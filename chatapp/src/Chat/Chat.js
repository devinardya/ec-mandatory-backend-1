import React, {useEffect, useState} from 'react';
import io from 'socket.io-client';
import { DataMessagesHistory } from '../socket';

let socket = io('localhost:3000');

const Chat = ({location}) => {

    const [input, updateInput] = useState("");
    const [messages, updateMessages] = useState([]);
    let name = location.state.user;
   
    useEffect(() => {
        DataMessagesHistory()
        .then( chatHistory => {
            console.log(chatHistory)
            updateMessages(chatHistory);
        })

    }, []);


    useEffect( () => {
        socket.on('new_message', function(data){
            console.log("new_message", data);
            //cb(null, data);
            let message = data;
            let copyMessage = [...messages];		
            updateMessages([...copyMessage, message]);
          });
    }, [messages]) 


    const onChange = (e) => {
        let value = e.target.value;
        updateInput(value);
    }

    const onSubmit = (e) => {
        e.preventDefault();

        //socket.emit('new_message', input);
        socket.emit("new_message",{
            username: name,
            content: input,
        })
        updateInput("");
        let message = {username: name, content: input};
        let copyMessage = [...messages];	
        //copyMessage.splice(0, 1);	
        updateMessages([...copyMessage, message]);
        
    }

    return <>
             <h1>Chat</h1>
             <p>Hej, {name}</p>
             <form onSubmit = {onSubmit}>
                 <input onChange={onChange} value={input}></input>
                 <button></button>
             </form>
             <div>
            {messages.map(data => {
                let pointKey;
                if (data.username === name){
                      pointKey = "messages-"+ Math.round(Math.random() * 99999999999);
                }else {
                      pointKey = data.id;
                }
                 //console.log(data)
                 return <div key={pointKey}>
                            <p>{data.username} : {data.content}</p>
                        </div>
             })
             } 
             </div>
           </>
}

export default Chat;