const express = require('express');
const app = express();
const uuid = require('uuid'); 
const fs = require('fs');


const {userCreateUser, userAddRoom} = require('./users');
const {roomsCreateRoom, roomsAddUsers, roomsAddActive, roomsRemoveActive} = require('./rooms');

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


const http = require('http').createServer(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 3000

app.get('/', (req, res) => {
 res.send('Server is running');
});

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
        socket.join(room, () => {

            let grettingObj = {
                username: "admin",
                content: name + " has joined " + room,
                chatRoom: room,
                id: uuid.v4()
            }

            socket.to(room).emit('incomingUser', grettingObj);

            //===========================================
            //===========================================

        
            // new way
            // do it in 2 steps
            // 1. create room and user (or check if user and room already exists)
            userData = userCreateUser({name});
            roomsData = roomsCreateRoom({room});

            // 2. add room for the user and add users for the room
            userData = userAddRoom({name, room, roomsData});
            roomsData = roomsAddUsers({name, room, userData});

            console.log("currentUserData", userData);
            console.log("currentRoomsData", roomsData)

            //===========================================
            //===========================================

            // 3. add active user to the room
            activeUser = roomsAddActive({name, room, userData});
            console.log(activeUser)
                
            socket.emit('updaterooms', userData);
            
            console.log("active users now", activeUser);
            io.in(room).emit('activeUsers', activeUser);
            console.log(roomsData)
            io.in(room).emit('updateUser', roomsData);
            

            console.log("THIS IS JOIN", room)
        })

       
        //===========================================
        //===========================================
      
        // Sending chat history from json saved file
  
         let filteredChat = chat.filter( x => x.chatRoom === room)
         io.in(room).emit('savedMessage', filteredChat);

    }); 

    socket.on('addingRoom', ({name, room}) => {

        console.log(room)
        roomsData = roomsCreateRoom({room});

        // 2. add room for the user and add users for the room
        userData = userAddRoom({name, room, roomsData});
        roomsData = roomsAddUsers({name, room, userData});

        console.log("USERDATA", userData);
        console.log("ROOMSDATA", roomsData);
        socket.emit('allRoomList', userData);
    });

    // when getting new message from client, saved it to file and send it back to 
    // the client to be added on the current chat
    socket.on('new_message', (data) => {
        data.id = uuid.v4();
        console.log(data)
        socket.to(data.chatRoom).emit('new_message', data);
        
        chat.push(data);

        saveChat();
    })

    socket.on('leave', ({name, room}) => {
        console.log("LEAVING ROOMS!!!!!")

        socket.leave(room, () => {
            /* console.log("user " + name + " is leaving room " + room)
            const index = currentActiveUser.indexOf(name);
            if (index > -1) {
            currentActiveUser.splice(index, 1);
            socket.to(room).emit('activeUsers', currentActiveUser);
            //io.in(room).emit('activeUsers', activeUser);
            } */
            
    
        });
        activeUser =  roomsRemoveActive({name, room})
        console.log("ACTIVE USERS AFTER LEAVING", activeUser)
        socket.to(room).emit('activeUsers', activeUser);
    })
   

    socket.on('disconnect', () => {
        io.emit('user disconnected');
        console.log("user has disconnected")
        
      });
});



http.listen(port, () => {
 console.log('listening on port ' + port);
});