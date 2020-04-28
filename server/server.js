const express = require('express');
const app = express();
const uuid = require('uuid'); 
const fs = require('fs');

const chatHistory = 'chat.json';
const allUser = 'user.json';
const allRooms = 'room.json';
const chat = JSON.parse(fs.readFileSync(chatHistory));
const userList = JSON.parse(fs.readFileSync(allUser));
const roomsList = JSON.parse(fs.readFileSync(allRooms));

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

function saveUser() {
    return new Promise((resolve, reject) => {
        fs.writeFile(allUser, JSON.stringify(userList), function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });

};

function saveRoom() {
    return new Promise((resolve, reject) => {
        fs.writeFile(allRooms, JSON.stringify(roomsList), function (err) {
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

//===========================================
            //===========================================

            let roomObj = {
                user: name,
                room: room,
                id : uuid.v4()
            }

            console.log("Room list", roomsList)
            let checkRoomTemp;
            let checkRoom;
            checkRoom = false;
            roomIsTrue = false;

            console.log('5. Checking rooms')
            roomsList.map(eachRooms => { 
                console.log("name", name, eachRooms.user)
                if(eachRooms.user === name){
                    console.log("checking same room", eachRooms.room, room)
                    checkRoomTemp = eachRooms.room.includes(room);
                    console.log(checkRoomTemp)
                    if (checkRoomTemp === true){
                        console.log("checking same room TRUE")
                        checkRoom = true;
                        // roomIsTrue = true;
                    }
                } else {
                    
                    // checkRoom = false;
                }
             });

                //console.log("name status", checkName)
                if(roomsList.length === 0){
                    //console.log("adding user")
                    roomsList.push(roomObj);
                    saveRoom();
                }  else if (checkRoom === false) {
                    //console.log("adding user 2")
                    roomsList.push(roomObj);
                    saveRoom();
                }
          

//===========================================
            //===========================================

            let checkNameTemp;
            let checkName;
             checkName = false;
             activeUser.map(user => { 
             //console.log(user)
             //console.log('current name',name)
             checkNameTemp = user.includes(name);
             if (checkNameTemp === true){
                 checkName = true;
             }
             // console.log("checkName", checkName)
             
            });

            if(activeUser.length === 0){
                //console.log("adding user")
                activeUser.push(name)
                
            }  else if (checkName === false) {
                //console.log("adding user 2")
                activeUser.push(name);
                
            }

            
            socket.emit('updaterooms', roomsList);
            
            console.log("active users now", activeUser);
            io.in(room).emit('activeUsers', activeUser);
           
            socket.to(room).emit('incomingUser', grettingObj);

            console.log("THIS IS JOIN", room)
        })

       
//===========================================
            //===========================================
      
         // Sending chat history from json saved file
  
         let filteredChat = chat.filter( x => x.chatRoom === room)
         io.in(room).emit('savedMessage', filteredChat);
        
         
         //creating new user object to be sent to the client
         let userObj = {
             name: name,
             id : uuid.v4()
         }
 
         
        //console.log(userList)
        let checkNameTemp;
        let checkName;
        checkName = false;
         userList.map(user => { 
             //console.log(user)
             //console.log('current name',name)
             checkNameTemp = user.name.includes(name);
             if (checkNameTemp === true){
                 checkName = true;
             }
             // console.log("checkName", checkName)
             
         });

         //console.log("name status", checkName)
         if(userList.length === 0){
             //console.log("adding user")
             userList.push(userObj);
             saveUser();
         }  else if (checkName === false) {
             //console.log("adding user 2")
             userList.push(userObj);
             saveUser();
         }

         // sending user list to the client
         console.log(userList)
         io.in(room).emit('updateUser', userList);

    }); 

    socket.on('addingRoom', ({name, newRoom}) => {
        console.log("The new room just added ", newRoom)

        let roomObj = {
            user: name,
            room: newRoom,
            id : uuid.v4()
        }

        let checkRoomTemp;
        let checkRoom;
        checkRoom = false;
        roomsList.map(eachRooms  => { 

            if(eachRooms.user === name) {
                checkRoomTemp = eachRooms.room.includes(newRoom);
                if (checkRoomTemp === true){
                    checkRoom = true;
                }
            } 
            
      
         });

         //console.log("name status", checkName)
         if(roomsList.length === 0){
             //console.log("adding user")
             roomsList.push(roomObj);
             saveRoom();
         }  else if (checkRoom === false) {
             //console.log("adding user 2")
             roomsList.push(roomObj);
             saveRoom();
         }

         socket.emit('allRoomList', roomsList);
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

        socket.leave(room, () => {
            console.log("user " + name + " is leaving room " + room)
            const index = activeUser.indexOf(name);
            if (index > -1) {
            activeUser.splice(index, 1);
            socket.to(room).emit('activeUsers', activeUser);
            //io.in(room).emit('activeUsers', activeUser);
            }
    
        });
    })

 

   /*  socket.on('switchRoom', ({oldRoom, newRoom}) =>{
        if(oldRoom)
            socket.leave(oldRoom);
    
        socket.join(newRoom);
    });
 */
   

    socket.on('disconnect', () => {
        io.emit('user disconnected');
        console.log("user has disconnected")
      });
});



http.listen(port, () => {
 console.log('listening on port ' + port);
});