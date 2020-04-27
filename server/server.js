const express = require('express');
const app = express();
const uuid = require('uuid'); 
const fs = require('fs');

const chatHistory = 'chat.json';
const allUser = 'user.json';
const chat = JSON.parse(fs.readFileSync(chatHistory));
const userList = JSON.parse(fs.readFileSync(allUser));

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
                content: name + " has joined",
                chatRoom: room,
                id: uuid.v4()
            }

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

            
            console.log("active users now", activeUser);
            io.in(room).emit('activeUsers', activeUser);
           
            socket.to(room).emit('incomingUser', grettingObj);
            //socket.broadcast.emit('incomingUser', grettingObj)
            //io.sockets.in(room).emit('incomingUser', {text: name + " has joined"});
            console.log("THIS IS JOIN", room)
        })
       

      
         // Sending chat history from json saved file
         // not working if one of below code is deleted
         //socket.broadcast.to(room).emit('savedMessage', chat)
         io.in(room).emit('savedMessage', chat);
         //io.sockets.emit('savedMessage', chat);
         
         //creating new room object to be sent to the client
         let roomObj = {
             room: room,
             id : uuid.v4()
         }

         //creating new user object to be sent to the client
         let userObj = {
             name: name,
             id : uuid.v4()
         }
 
         //sending notification about the current chat room
         //socket.broadcast.to(room).emit('message', chat)
         io.in(room).emit('updaterooms', [roomObj]);
         //io.sockets.emit('updaterooms', [roomObj]);

         // adding the user to the saved file, skipping name that is already in the data
         
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
         //io.sockets.emit('updateUser', userList); 

    }) 

    // when getting new message from client, saved it to file and send it back to 
    // the client to be added on the current chat
    socket.on('new_message', (data) => {
        data.id = uuid.v4();
        console.log(data)
        socket.to(data.chatRoom).emit('new_message', data);
        //socket.broadcast.to(data.chatRoom).emit('new_message', data)
        //io.sockets.emit('new_message', data);
        //socket.broadcast.emit('new_message', data);
        console.log("before pushin data")
        chat.push(data);

        saveChat();
    })

    socket.on('leave', ({name, room}) => {

        socket.leave(room, () => {
            console.log("user " + name + " is leaving")
            const index = activeUser.indexOf(name);
            if (index > -1) {
            activeUser.splice(index, 1);
            socket.to(room).emit('activeUsers', activeUser);
            //io.in(room).emit('activeUsers', activeUser);
            }
    
        });
    })

   

    socket.on('disconnect', () => {
        io.emit('user disconnected');
        console.log("user has disconnected")
      });
});



http.listen(port, () => {
 console.log('listening on port ' + port);
});