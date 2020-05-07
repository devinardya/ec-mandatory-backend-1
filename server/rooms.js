/* const fs = require('fs');
const allRooms = 'room.json';
const uuid = require('uuid'); 
const roomsList = JSON.parse(fs.readFileSync(allRooms)); */

//const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
//const url = 'mongodb://localhost:27017';

// Database Name
//const dbName = 'chatapp';

// Create a new MongoClient
//const client = new MongoClient(url);

const uuid = require('uuid'); 

// Save data to JSON
/* function saveRoom() {
    return new Promise((resolve, reject) => {
        fs.writeFile(allRooms, JSON.stringify(roomsList), function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}; */
let resultData = []

function saveRoom(db, data){	

    console.log("TRYING TO SAVE NEW ROOM", data)
    
    return new Promise( (resolve, reject) => {
        db.collection('rooms').insertOne(data, (err,result)=>{
            if(err){
                console.log("not inserted", err);
                reject()
            }else {
                console.log("inserted");
                resolve();
            }
            
            //console.log("result", result)
        });
    })

}


const roomsList = function(db) {
    // Get the documents collection
    const collection = db.collection('rooms');
    // Find some documents
    
    collection.find({}).toArray(function(err, docs) {
      assert.equal(err, null);
      console.log("Found the following records");
      console.log("DOCS", docs)
      //callback(docs);
      resultData.push(docs)
      //return resultData = docs;
    });
    return resultData;
   
  }


function updateRoomByName(db, roomName, updatedData) {
   
    console.log("room name", roomName.usersroom)
    console.log("UPDATEDATAUSER", updatedData)
    let myquery = { usersroom: roomName.usersroom };
    let newvalues = { $push: {username: updatedData} };

    return new Promise((resolve, reject) => {
        db.collection("rooms").updateOne(myquery, newvalues, { upsert: true }, function(err, res) {
            if (err) {
                reject();
            }else {
                console.log("1 document updated");
                resolve();
            }
            
        });

       
    });

}

function updateRoomByActive(db, roomName, updatedData) {
    console.log("room name", roomName.usersroom)
    console.log("UPDATEDATAACTIVE", updatedData)
    let myquery = {usersroom: roomName.usersroom };
    let newvalues = { $push: {activeUsers: updatedData} };

    return new Promise((resolve, reject) => {
        db.collection("rooms").updateOne(myquery, newvalues, { upsert: true }, function(err, res) {
            if (err) {
                reject();
            }else {
                resolve();
                console.log("1 document updated",);
            }
            
        });
        
    });

}




// Create a new room
function roomsCreateRoom({db, room}){
    let roomExists = false;
    let copyRoom = room.toLowerCase();

    
    resultData.map(eachRoom => {
        let copyFromArray = eachRoom.usersroom.toLowerCase();
        if (copyFromArray === copyRoom){
            // remember room already exist
            roomExists = true;
        } 
    })

    if (roomExists === true) {
        // The room already exists. no nothing
        console.log('The room ', room, ' already exists. No new room added.')
        
    } else {
        roomData = { username : [],  
                     usersroom : room,
                     id : uuid.v4(),
                     activeUsers : []
                    }

        resultData.push(roomData);
        //saveRoom();
        //saveRoom(roomData)
        saveRoom(db, roomData);
        console.log("A new room: ", room, " was added.");
        //console.log(roomsList)
        
    }
    return resultData;
}

// Create the general room
function roomsInitiateRooms({db}){
    console.log("DID IT GET HERE? TO INITIATE GENERAL")

    let roomExists = false;
    let copyFromArray;
    let room = 'General';
    resultData.map(eachRoom => {
        copyFromArray = eachRoom.usersroom.toLowerCase();	        
        if (copyFromArray === room.toLowerCase()){
            // remember room already exist
            roomExists = true;
        } 
    })

    if (roomExists === true) {
        // General room already exists. Do nothing
        return resultData;
    } else {
        roomData = { username : [],  
                     usersroom : room,
                     id : uuid.v4(),
                     activeUsers : []
                    }
        //roomsList.push(roomData);
        //saveRoom();
        resultData.push(roomData);
        saveRoom(db, roomData);
        console.log("A new room: ", room, " was added.")
        return resultData;
       
    }
}

// Add rooms for a user
function roomsAddUsers({db, name, room, userData}){

    let currentRoom;
    let currentUsers;
    let userExists;

    // Find the current room
    console.log("RESULTDATA", resultData)
    currentRoom = resultData.find(x => x.usersroom.toLowerCase() === room.toLowerCase());
    
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
        //saveRoom(db, resultData);
        updateRoomByName(db, currentRoom, userData)
        console.log("A new user: ", name, " was added to room ", room)
    } else {
        // there is a room at the index roomExists
        // do nothing
        console.log("No new users was added to the room ", room)
    }

    return resultData;
}

// Add active user to a room
function roomsAddActive({db, name, room, userData}){

    let currentRoom;
    let currentUsers;
    let userExists;

    // Find the current room
    currentRoom = resultData.find(x => x.usersroom.toLowerCase() === room.toLowerCase())
    // Find rooms current users
    currentUsers = currentRoom.activeUsers;
    // Does the user already exist in this room? 
    userExists = currentUsers.some( x => x.username === name)
    
    if (!userExists){
        // -1 === no matches 
        // add the user for the room
        let thisuser = userData.findIndex(x => x.username === name);

        userData = { username : userData[thisuser].username,  
                    id : userData[thisuser].id
           }
        currentUsers.push(userData);
        updateRoomByActive(db, currentRoom,userData)
        console.log("A new active user: ", name, " was added to room ", room)
       
    } else {
        // there is a room at the index roomExists
        // do nothing
        console.log("No new active users was added to the room ", room)
       
       
    }
    return currentUsers;
}


// Remove active user from a room
function roomsRemoveActive({db, name, room}){

    let currentRoom;
    let currentUsers;
    let userExists;

    // Find the current room
    currentRoom = resultData.find(x => x.usersroom.toLowerCase() === room.toLowerCase())
    // Find rooms current users
    currentUsers = currentRoom.activeUsers;
    // Does the user already exist in this room? 
    userExists = currentUsers.findIndex(x => x.username === name);
    if (userExists === -1){
        // -1 === no matches 
        // do nothing

    } else {
        currentUsers.splice(userExists,1);
        console.log("Active user ", name, "was removed from room ", room)
        // there is a user to remove
        //currentUsers.splice(userExists,1);
    }
    console.log("CURRENTUSERS", currentUsers)
    return currentUsers;
}

function roomRemoveUser({room, userId, roomsData}) {

    let copyRoomData = [...roomsData];

    copyRoomData.map( eachChatRoom => {
        if(eachChatRoom.usersroom === room) {
             const listIndex = eachChatRoom.username.findIndex (x => x.id === userId);
             let copyDataChatRoom = [...eachChatRoom.username]
             copyDataChatRoom.splice(listIndex, 1);
             eachChatRoom.username = copyDataChatRoom;
             copyRoomData.push(copyDataChatRoom);
             saveRoom();  
         }
         
     });

    return copyRoomData;

    
}



module.exports = {roomsCreateRoom, roomsAddUsers, roomsAddActive, roomsRemoveActive, roomsInitiateRooms, roomRemoveUser};