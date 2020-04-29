const express = require('express');
const app = express();
const uuid = require('uuid'); 
const fs = require('fs');

const {userCreateUser, userAddRoom} = require('./users');
const {roomsCreateRoom, roomsAddUsers, roomsAddActive, roomsRemoveActive, roomsInitiateRooms} = require('./rooms');

const chatHistory = 'chat.json';
const chat = JSON.parse(fs.readFileSync(chatHistory));



function saveChat() {
    return new Promise((resolve, reject) => {
        fs.writeFile(chatHistory, JSON.stringify(chat), function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};


// ===============
// Socket server
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send('Server is running');
});

http.listen(port, () => {
    console.log('listening on port ' + port);
});

// ===============
// Users and rooms

let activeUser = [];
let userData = [];
let roomsData = [];



io.on('connect', (socket) => {
    console.log('0. User connected to server');
    
    //io.emit('message', chat);

    // getting an emit from client.
    // handling "join" emit
    socket.on('join', ({name, room}) => {
     
        //const {error, user} = addUser({ id:socket.id, name, room})
        console.log("1. User joining chat. User ", name, " in room ",room)

        //===========================================
        //===========================================

        // 1. create room and user (or check if user and room already exists)
        userData = userCreateUser({name});
        roomsData = roomsInitiateRooms();
        console.log('my current roomsdata', roomsData)
        // roomsData = [...theRooms]
       /*  const {error, roomsList} = roomsCreateRoom({room});
        console.log(error)
        if(!error) {
            roomsData = [...roomsList]
        } */

        //===========================================
        //===========================================

        // 2. add room for the user and add users for the room
        userData = userAddRoom({name, room, roomsData});
        roomsData = roomsAddUsers({name, room, userData});

        console.log("currentUserData", userData);
        console.log("currentRoomsData", roomsData)

        //===========================================
        //===========================================

        // 3. add active user to the room
        activeUser = roomsAddActive({name, room, userData});
 
        //===========================================
        //===========================================

        // 4. If user name is unique, then join the room 

        socket.join(room, () => {
            console.log("THIS ", name, "IS JOINING ROOM ", room)
        })

        //===========================================
        //===========================================

        // 5. Emitting all data back to client

        socket.emit('updaterooms', userData);
        
        console.log("active users now", activeUser);
        io.in(room).emit('activeUsers', activeUser);
        console.log(roomsData)
        io.in(room).emit('updateUser', roomsData);

        let grettingObj = {
            username: "Admin",
            content: name + " has joined " + room,
            chatRoom: room,
            id: uuid.v4()
        }

        socket.to(room).emit('incomingUser', grettingObj);

        //===========================================
        //===========================================
      
        // 6. Sending chat history from json saved file
  
         let filteredChat = chat.filter( x => x.chatRoom === room)
         io.in(room).emit('savedMessage', filteredChat);
    }); 

    socket.on('addingRoom', ({name, room}, cb) => {

       console.log("ROOM DATA BEFORE ADDING", roomsData)
       let checkRoomList = roomsData.some(x => x.usersroom.toLowerCase() === room.toLowerCase())
       console.log("check room list", checkRoomList)
       if (checkRoomList) {
            console.log("room exist")
            cb([{error: "ERROR: room is already exists!"}]);
       } else {
            console.log("room NOT exist")
            roomsData = roomsCreateRoom({room});
            
           
       }
        // write an if statement that has looped through roomData
        // checking if room exists

        // room does not exists
        // 1. Creating new room
           
            
            
        // 2. add room for the user and add users for the room
        console.log("my new roomdata after adding a room ", roomsData)
        userData = userAddRoom({name, room, roomsData});
        console.log("my new userdata after adding a room ", userData)
        roomsData = roomsAddUsers({name, room, userData});

        console.log("USERDATA", userData);
        console.log("ROOMSDATA", roomsData);
        socket.emit('allRoomList', userData);

        cb();
    });

    // when getting new message from client, saved it to file and send it back to 
    // the client to be added on the current chat
    socket.on('new_message', (data) => {
        data.id = uuid.v4();
        console.log(data)
        socket.to(data.chatRoom).emit('new_message', data);
        
        chat.push(data);

        saveChat();
    });

    socket.on('leave', ({name, room}) => {
        console.log("LEAVING ROOMS!!!!!")

        socket.leave(room);
        activeUser =  roomsRemoveActive({name, room})
        console.log("ACTIVE USERS AFTER LEAVING", activeUser)
        socket.to(room).emit('activeUsers', activeUser);
    });
   

    socket.on('disconnect', () => {
        io.emit('user disconnected');
        console.log("user has disconnected")
        
    });
});



