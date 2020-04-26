import io from 'socket.io-client';


function DataMessagesHistory(){

    const socket = io('localhost:3000');
    
    function connect(){
        return new Promise((resolve, reject) => {
            socket.on('connect', function(){
                resolve(console.log("CONNECTED")) 
            })
        })
    }

  /*   function getDefaultRoom() {
        console.log("to updatechat")
        return new Promise((resolve, reject) =>{
            socket.on('updatechat', function (data, text) {
            console.log(data, text);
            resolve(text);
             });
        })
    } */

   /*  function getDefaultRoom(){
        console.log("to get room")
        return new Promise((resolve, reject) =>{
            socket.on('updaterooms', data =>{
                console.log("update room", data);
                resolve(data);
            })
        })
    }

    function getDataHistory(){
        console.log("to get messages")
        return new Promise((resolve, reject) =>{
            socket.on('message', chat =>{
                console.log("message", chat);
                resolve(chat);
            })
        })
    } */
  

    return connect()
    /* .then(getDataHistory)
    .then(getDefaultRoom) */

}

export {DataMessagesHistory};

