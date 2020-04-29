const fs = require('fs');
const allRooms = 'room.json';
const uuid = require('uuid'); 
const roomsList = JSON.parse(fs.readFileSync(allRooms));

// Save data to JSON
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

// Create a new user
function roomsCreateRoom({room}){
    let roomExists = false;

    roomsList.map(eachRoom => {
        if (eachRoom.usersroom === room){
            // remember room already exist
            roomExists = true;

        } 
    })

    if (roomExists === true) {
        // user already exists. do no do anything
        console.log('The room ', room, ' already exists. No new room added.')
    } else {
        roomData = { username : [],  
                     usersroom : room,
                     id : uuid.v4(),
                     activeUsers : []
                    }
        roomsList.push(roomData);
        saveRoom();
        console.log("A new room: ", room, " was added.")
    }

    return roomsList;
}


// Add rooms for a user
function roomsAddUsers({name, room, userData}){

    let currentRoom;
    let currentUsers;
    let userExists;

    // Find the current room
    currentRoom = roomsList.find(x => x.usersroom === room)
    // Find rooms current users
    currentUsers = currentRoom.username;
    // Does the user already exist in this room? 
    userExists = currentUsers.findIndex(x => x.username === name);

    if (userExists === -1){
        // -1 === no matches 
        // add the user for the room
        let thisuser = userData.findIndex(x => x.username === name);

        userData = { username : userData[thisuser].username,  
                    id : userData[thisuser].id
           }
        currentUsers.push(userData);
        saveRoom();
        console.log("A new user: ", name, " was added to room ", room)
    } else {
        // there is a room at the index roomExists
        // do nothing
        console.log("No new users was added to the room ", room)
    }

    return roomsList;
}

// Add active user to a room
function roomsAddActive({name, room, userData}){

    let currentRoom;
    let currentUsers;
    let userExists;

    // Find the current room
    currentRoom = roomsList.find(x => x.usersroom === room)
    // Find rooms current users
    console.log("CURRENTROOM", currentRoom);
    currentUsers = currentRoom.activeUsers;
    // Does the user already exist in this room? 
    console.log("CURRENTUSERS", currentUsers);
    userExists = currentUsers.some( x => x.username === name)
    console.log("USEREXIST", userExists)
    if (userExists === false){
        // -1 === no matches 
        // add the user for the room
        let thisuser = userData.findIndex(x => x.username === name);

        userData = { username : userData[thisuser].username,  
                    id : userData[thisuser].id
           }
        currentUsers.push(userData);
        saveRoom();
        console.log("A new active user: ", name, " was added to room ", room)
    } else {
        // there is a room at the index roomExists
        // do nothing
        console.log("No new active users was added to the room ", room)
    }

    return currentUsers;
}


// Add active user to a room
function roomsRemoveActive({name, room}){

    let currentRoom;
    let currentUsers;
    let userExists;

    // Find the current room
    currentRoom = roomsList.find(x => x.usersroom === room)
    // Find rooms current users
    currentUsers = currentRoom.activeUsers;
    // Does the user already exist in this room? 
    userExists = currentUsers.findIndex(x => x.activeUsers === name);

    if (userExists === -1){
        // -1 === no matches 
        currentUsers.splice(userExists,1);
        console.log("Active user ", name, "was removed from room ", room)
        // do nothing

    } else {
        // there is a user to remove
        //currentUsers.splice(userExists,1);

        
    }

    return currentUsers;
}



module.exports = {roomsCreateRoom, roomsAddUsers, roomsAddActive, roomsRemoveActive};