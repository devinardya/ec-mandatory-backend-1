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

let usernames = {};
let rooms = ["general"]

io.on('connect', (socket) => {
    console.log('a user connected');
    //io.emit('message', chat);

  /*   socket.join('general', () => {
        socket.emit('updatechat', 'SERVER', 'you have connected to ' + 'general');
        console.log("THIS IS JOIN", socket.rooms)
        io.sockets.in('general').emit('message', chat);
        //socket.broadcast.to('general').emit('updatechat', {text: name + " has joined"})
        
        let roomObj = {
            room: 'general',
            id : uuid.v4(),
        }
     
        //socket.emit('updaterooms', roomObj);

        socket.broadcast.to('general').emit('message', chat)
        io.sockets.in('general').emit('updaterooms', roomObj);
       
        //socket.broadcast.to(room).emit('updatechat', {text: name + " has joined"})
    })   */

    socket.on('join', ({name, room}) => {
        //const {error, user} = addUser({ id:socket.id, name, room})
        console.log(name, room)
        socket.join(room, () => {
            socket.broadcast.to(room).emit('updatechat', {text: name + " has joined"})
            console.log("THIS IS JOIN", socket.rooms)
            socket.broadcast.to(room).emit('message', chat)
            io.sockets.in(room).emit('message', chat);
            
            let roomObj = {
                room: room,
                id : uuid.v4()
            }

            let userObj = {
                name: name,
                id : uuid.v4()
            }
    
            //socket.broadcast.to(room).emit('message', chat)
            io.sockets.in(room).emit('updaterooms', roomObj);
            
           console.log(userList)
           let checkNameTemp;
           let checkName;
           checkName = false;
            userList.map(user => { 
                console.log(user)
                console.log('current name',name)
                checkNameTemp = user.name.includes(name);
                if (checkNameTemp === true){
                    checkName = true;
                }
                // console.log("checkName", checkName)
                
            });
            console.log("name status", checkName)
            if(userList.length === 0){
                console.log("adding user")
                userList.push(userObj);
                saveUser();
            }  else if (checkName === false) {
                console.log("adding user 2")
                userList.push(userObj);
                saveUser();
            }

            io.sockets.in(room).emit('updateUser', userList);

        })
       // socket.emit('updatechat', 'SERVER', 'you have connected to' + room);
       

        
    }) 

	/* socket.on('adduser', function(username){
        socket.on('addRoom', room => {
            console.log(username, room)
            currentRoom = room;
            socket.username = username;
            // store the room name in the socket session for this client
            socket.room = room;
            // add the client's username to the global list
            usernames[username] = username;
            //console.log(usernames);
            let roomObj = {
                room: room,
                id : uuid.v4()
            }

            // send client to room 1
            socket.join(room);
            // echo to client they've connected
            socket.emit('updatechat', 'SERVER', 'you have connected to' + room);
            // echo to room 1 that a person has connected to their room
            socket.broadcast.to(room).emit('updateChat', 'SERVER', username + ' has connected to this room');
            socket.emit('updaterooms', rooms, roomObj);
        }); 
	}); */


  /*   socket.on('join', ({name, room}) => {
        console.log(name, room);
        theRoom = room
    })

    socket.broadcast.to(theRoom).emit('function', "hi room") */
   
    //socket.emit('message', chat)
  
    socket.on('new_message', (data) => {
        data.id = uuid.v4();
        console.log(data)
        socket.broadcast.to(data.chatRoom).emit('new_message', data)
        //io.sockets.in(data.chatRoom).emit('new_message', data);
        //socket.broadcast.emit('new_message', data);
        chat.push(data);

        saveChat();
    })

    socket.on('disconnect', () => {
        io.emit('user disconnected');
        console.log("user has left")
      });
});



http.listen(port, () => {
 console.log('listening on port ' + port);
});