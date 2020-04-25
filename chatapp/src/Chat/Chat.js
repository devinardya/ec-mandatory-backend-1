import React, {useEffect, useState, useRef} from 'react';
import io from 'socket.io-client';
import { DataMessagesHistory } from '../socket';
import '../Chat/chat.scss';
import { Redirect } from 'react-router-dom';

let socket = io('localhost:3000');

const Chat = ({location}) => {

    const [input, updateInput] = useState("");
    const [messages, updateMessages] = useState([]);
    const [room, updateRoom] = useState('general');
    const [chatRooms, updateChatRooms] =  useState([]);
    const [loginStatus, updateLoginStatus] = useState(true);
    let name = location.state.user;
    const chatWindow = useRef(null);

    useEffect( () => {
        // on connection to server, ask for user's name with an anonymous callback
        socket.emit('adduser', name);
        console.log(room)
        socket.emit('addRoom', room)
    }, [name, room])

    useEffect( () => {
        socket.on('updatechat', function (username, data) {
            console.log(username, data)
             });
    
            socket.on('updateChat', (username, text) => {
                console.log(username, text)
            })
    }, [])

    useEffect( () => {
        socket.on('updaterooms', function(rooms, current_room) {
            updateChatRooms([...chatRooms, current_room])
           console.log(rooms, current_room )
        });
    }, [chatRooms])
   
    useEffect(() => {
        DataMessagesHistory()
        .then( chatHistory => {
            console.log(chatHistory)
            updateMessages(chatHistory);
        })

    }, []);

    const scrollToBottom = () => {
        chatWindow.current.scrollIntoView({ behavior: "smooth" })
      }
    
      useEffect(scrollToBottom, [messages]);


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
            chatRoom: room
        })
        updateInput("");
        let message = {username: name, content: input};
        let copyMessage = [...messages];	
        //copyMessage.splice(0, 1);	
        updateMessages([...copyMessage, message]);
    }

    const logout = () => {
        socket.close();
        console.log("DISCONNECTED")
        updateLoginStatus(false);
    }

    if (!loginStatus) {
        return <Redirect to="/"/>
    }

    return <div className="block__chatPage">
                <div className="block__chatPage__sidebar">
                    <div className="block__chatPage__sidebar--userbox">
                        <h2>Welcome, {name}</h2>
                    </div>
                    <div className="block__chatPage__sidebar--userlist">
                        <h3>Room user</h3>
                        <p>Nono</p>
                        <p>Bebe</p>
                        <p>Bubu</p>
                        <p>Jo</p>
                    </div>
                    <div className="block__chatPage__sidebar--roomlist">
                        <h3>Room list</h3>
                        {chatRooms.map(room => {
                            return <p key={room.id}>{room.room}</p>
                        })
                        }
                    </div>
                    <div>
                        <button onClick={logout}>Leave chat</button>
                    </div>
                </div>
                <div className="block__chatPage__mainbar">
                    <div className="block__chatPage__mainbar--chatbox">
                        {messages.map(data => {
                            let pointKey;
                            let boxClassName;
                            if (data.username === name){
                                pointKey = "messages-"+ Math.round(Math.random() * 99999999999);
                                boxClassName = "block__chatPage__mainbar--chatbox--message--sender"
                            }else {
                                pointKey = data.id;
                                boxClassName = "block__chatPage__mainbar--chatbox--message--incoming"
                            }
                            //console.log(data)
                            return <div className={boxClassName} key={pointKey}>
                                        <div className="block__chatPage__mainbar--chatbox--message--image"></div>
                                        <div className="block__chatPage__mainbar--chatbox--message--blockText">
                                            <p className="block__chatPage__mainbar--chatbox--message--username">{data.username}</p>
                                            <p className="block__chatPage__mainbar--chatbox--message--text">{data.content}</p>
                                        </div>
                                    </div> 
                            })
                        } 
                        <div ref={chatWindow} />
                    </div>
                    <div className="block__chatPage__mainbar--form">
                        <form onSubmit = {onSubmit}>
                            <input onChange={onChange} type="text" placeholder="Enter messages..."  value={input}></input>
                            <button>Submit</button>
                        </form>
                    </div>
                </div>
           </div>
}

export default Chat;