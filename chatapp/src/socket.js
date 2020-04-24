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

    function getDataHistory(){
        return new Promise((resolve, reject) =>{
            socket.on('message', data =>{
                console.log("message", data);
                resolve(data);
            })
        })
    }

    return connect()
    .then(getDataHistory)

}

export {DataMessagesHistory};

/* 
function DataMessagesUpdate(socket, cb){
    socket.on('new_message', function(message){
      console.log("new_message", message);
      cb(null, message);
    });
  
      
  }
  
  export {DataMessagesUpdate}; */