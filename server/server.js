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

io.on('connection', (socket) => {
 console.log('a user connected');

 io.emit('message', chat);

 socket.on('new_message', (data) => {
     data.id = uuid.v4();
     console.log(data)
     socket.broadcast.emit('new_message', data);
     chat.push(data);

     saveChat()
     .then( () => {
         res.status(201).send(chat)
     });
 })

   
});



http.listen(port, () => {
 console.log('listening on port ' + port);
});