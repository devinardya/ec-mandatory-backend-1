const express = require('express');
const app = express();
const uuid = require('uuid'); 

const {userCreateUser, userAddRoom, userRemoveRoom} = require('./users');
const {roomsCreateRoom, roomsAddUsers, roomsAddActive, roomsRemoveActive, roomsInitiateRooms, roomRemoveUser} = require('./rooms');
const {newMessage} = require('./messages');


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
let chat = [];


// CONNECT TO SOCKET THEN JOIN THE DEFAULT ROOM =================================================================    

io.on('connect', (socket) => {
    console.log('0. User connected to server');
    
    //io.emit('message', chat);

    // getting an emit from client.
    // handling "join" emit
    socket.on('join', ({name, room}) => {
     
        //const {error, user} = addUser({ id:socket.id, name, room})
        console.log("1. User joining chat. User ", name, " in room ",room)

        let data = {
            username: "Admin",
            content: name + " has joined " + room,
            chatRoom: room,
            //id : uuid.v4()
        }

        chat = newMessage({data})
        //socket.to(room).emit('statusUser', chat);
        
        //===========================================
        //===========================================

        // 1. create room and user (or check if user and room already exists)
        userData = userCreateUser({name});
        roomsData = roomsInitiateRooms();
        //console.log('my current roomsdata', roomsData)
      
        //===========================================
        //===========================================

        // 2. add room for the user and add users for the room
        console.log('2. Adding user and room')
        userData = userAddRoom({name, room, roomsData});
        roomsData = roomsAddUsers({name, room, userData});

        //console.log("currentUserData", userData);
        //console.log("currentRoomsData", roomsData)

        //===========================================
        //===========================================

        // 3. add active user to the room
        console.log('3. Adding active user to room ', room)
        activeUser = roomsAddActive({name, room, userData});
        console.log('my current roomsdata', roomsData)
 
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

        

        //===========================================
        //===========================================
      
        // 6. Sending chat history from json saved file
  
        let filteredChat = chat.filter( x => x.chatRoom === room)

        if (filteredChat.some(x => x.username === "Admin")) {
            console.log("IT'S ADMIN")
            socket.to(room).emit('statusUser', filteredChat);
            io.in(room).emit('savedMessage', filteredChat);
        } else {
            io.in(room).emit('savedMessage', filteredChat);
        }
         
         //console.log("FILTEREDCHAT", filteredChat)
         
    }); 

// ADDING ROOM =================================================================    

    socket.on('addingRoom', ({name, room}, cb) => {

       //console.log("ROOM DATA BEFORE ADDING", roomsData)
       let checkRoomList = roomsData.some(x => x.usersroom === room)
       //console.log("check room list", checkRoomList)
       if (checkRoomList) {
            userData.map( x => {
                let checkstatus;
                if (x.username === name) {
                    console.log("found the same username")
                    console.log(x.usersroom)
                    checkstatus = x.usersroom.some(x => x.usersroom === room)
                    console.log(checkstatus);
                }

                if(checkstatus) {
                    cb({error: "ERROR: room is already exists!"});
                } else {
                    userData = userAddRoom({name, room, roomsData});
                    console.log("my new userdata after adding a room ", userData)
                    roomsData = roomsAddUsers({name, room, userData});
                    socket.emit('allRoomList', userData);
                }
                                  
            })
       } else {
            console.log("room NOT exist")
            roomsData = roomsCreateRoom({room});

            userData = userAddRoom({name, room, roomsData});
            console.log("my new userdata after adding a room ", userData)
            roomsData = roomsAddUsers({name, room, userData});
            socket.emit('allRoomList', userData);
       }
   

        cb();
    });

// SENDING NEW MESSAGES =================================================================    

    // when getting new message from client, saved it to file and send it back to 
    // the client to be added on the current chat
    socket.on('new_message', (data) => {
        
        chat = newMessage({data})
        let filteredChat = chat.filter( x => x.chatRoom === data.chatRoom)
        socket.to(data.chatRoom).emit('new_message', filteredChat);
    });


// REMOVE ROOM =================================================================    

    socket.on('remove_room', ({name, room, roomId, userId}) => {
        console.log("REMOVE ROOM")

        socket.leave(room, () => {
            console.log("the user ", name, "leave room ", room)
        })

        userData = userRemoveRoom({name, roomId, userData});
        console.log("after remove room data from USERDATA", userData);

        roomsData = roomRemoveUser({room, userId, roomsData});
        console.log("after remove user data from ROOMDATA", roomsData);

        activeUser =  roomsRemoveActive({name, room})
        console.log("ACTIVE USERS AFTER LEAVING", activeUser)
        socket.to(room).emit('activeUsers', activeUser);

        socket.emit('allRoomList', userData);
        io.in(room).emit('updateUser', roomsData);

    })

// SWITCHING ROOM =================================================================    

    socket.on('leave', ({name, room}) => {
        console.log(name, "LEAVING ROOMS!!!!!");

        let data = {
            username: "Admin",
            content: name + " has left room ",
            chatRoom: room,
            //id : uuid.v4()
        }

        chat = newMessage({data})
        socket.to(room).emit('statusUser', chat);

        socket.leave(room);
        
        activeUser =  roomsRemoveActive({name, room})
        console.log("ACTIVE USERS AFTER LEAVING", activeUser)
        socket.to(room).emit('activeUsers', activeUser);
    });
   
// LEAVING CHAT APP =================================================================    

    socket.on('disconnect', () => {
        io.emit('user disconnected');
        console.log("user has disconnected")
        
    });
});



