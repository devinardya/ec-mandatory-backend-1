import io from 'socket.io-client';

const socket = io('localhost:3000');

function DataMessagesHistory(){

    
    
    function connect(){
        return new Promise((resolve, reject) => {
            socket.on('connect', function(){
                resolve(console.log("CONNECTED")) 
            })
        })
    }

  /*   function join() {
        console.log("socket join")
        socket.emit('join', {name, room});
        socket.on('updatechat', data => {
            console.log(data)
        })
    } */

 /*    function updateUser() {
        console.log("UPDATE USER")
        return new Promise((resolve, reject) => {
            socket.on('updateUser', userlist => {
            console.log(userlist)
            resolve(userlist)
            })
        })
    } */

    

  

    return connect()
    //.then(join)
    //.then(updateUser)
    //.then(updateRoom)
    /* .then(getDataHistory)
    .then(getDefaultRoom) */

}



/* function updateRoomName() {
    console.log("UPDATE ROOM")
    return new Promise((resolve, reject) => {
        socket.on('updaterooms', current_room =>{
        console.log("update room", current_room);
        resolve(current_room)
        })
    })
} */

export {DataMessagesHistory};

