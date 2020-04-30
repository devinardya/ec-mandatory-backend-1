

function updateUser(socket, cb) {
    socket.on('updateUser', userlist => {
    console.log(userlist)
    cb(null, userlist);
    })
}

export {updateUser};

function updateCurrentRoom(socket, cb) {
    socket.on('updaterooms', current_room =>{
    console.log("update room", current_room);
    cb(null, current_room)
    })
}

export {updateCurrentRoom};

function getChatHistory(socket, cb) {
    socket.on('savedMessage', chatHistory =>{
    console.log("savedMessage", chatHistory);
    cb(null, chatHistory); 
    })
}

export {getChatHistory};

function getIncomingUser(socket, cb) {
    socket.on('incomingUser', data => {
    console.log(data);
    cb(null, data)
    })
}

export {getIncomingUser};

function getNewMessages(socket, cb) {
    socket.on('new_message', function(data){
    console.log("new_message", data);
    cb(null, data); 
    });
}

export {getNewMessages};

function getActiveUsers(socket, cb) {
    socket.on('activeUsers', data => {
        console.log("active_users", data);
        cb(null, data); 
    })
}

export {getActiveUsers};


function getAllRoomsList(socket, cb) {
    socket.on('allRoomList', data => {
        console.log("all rooms list", data);
        cb(null, data); 
    })
}

export {getAllRoomsList};


