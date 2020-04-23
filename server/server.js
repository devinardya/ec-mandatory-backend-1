const express = require('express');
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
 res.send('<p>hello</p>');
});

io.on('connection', (socket) => {
 console.log('a user connected');
});

http.listen(3000, () => {
 console.log('listening on 3000');
});