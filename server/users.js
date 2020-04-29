const fs = require('fs');
const allUser = 'user.json';
const uuid = require('uuid'); 
const userList = JSON.parse(fs.readFileSync(allUser));

// Save data to JSON
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

// Create a new user
function userCreateUser({name}){
    let userExists = false;

    userList.map(eachUser => {
        
        if (eachUser.username === name){
            // remember user already exist
            userExists = true;

        } 
    })

    if (userExists === true) {
        // user already exists. do no do anything
        console.log('The username ', name, ' already exists. No new user added.')
    } else {
        userData = { username : name,  
                     usersroom  : [],
                     id : uuid.v4()
                    }
        userList.push(userData);
        saveUser();
        console.log("A new user: ", name, " was added.")
    }

    return userList;
}

// Add rooms for a user
function userAddRoom({name, room, roomsData}){

    let currentUser;
    let currentRooms;
    let roomExists;

    // Find the current user
    currentUser = userList.find(x => x.username === name)
    // Find users current room
    currentRooms = currentUser.usersroom ;
    // Does the room already exist for this user? 
    roomExists = currentRooms.findIndex(x => x.usersroom  === room);

    // console.log("test 1: ", userList.find(x => x.username === name));
    // console.log('currentUser: ', currentUser)
    // console.log('currentRooms: ', currentRooms);
    // console.log("test x:", roomExists)
    if (roomExists === -1){
        // -1 === no matches 
        // add the room for the user

        let thisroom = roomsData.findIndex(x => x.usersroom  === room);
        console.log("the room: ", thisroom)
        console.log("the room: ", roomsData[thisroom])

        roomData = { usersroom  : roomsData[thisroom].usersroom ,  
                    id : roomsData[thisroom].id
           }
        currentRooms.push(roomData);
        saveUser();
        console.log("A new room: ", room, " was added to user ", name)
    } else {
        // there is a room at the index roomExists
        // do nothing
        console.log('No new rooms was added to user ', name)
    }

    return userList;
}


module.exports = {userCreateUser, userAddRoom};