const express = require('express');
const app = express();
const uuid = require('uuid'); 
const fs = require('fs');

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

let usernames = {};

let rooms = []
let currentRoom;
io.on('connect', (socket) => {
    console.log('a user connected');
    //io.emit('message', chat);

	socket.on('adduser', function(username){
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
	});

	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.in(socket.room).emit('updatechat', socket.username, data);
    })

  /*   socket.on('join', ({name, room}) => {
        console.log(name, room);
        theRoom = room
    })

    socket.broadcast.to(theRoom).emit('function', "hi room") */
   
    socket.emit('message', chat)
  
  

    socket.on('new_message', (data) => {
        data.id = uuid.v4();
        console.log(data)
        socket.broadcast.emit('new_message', data);
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