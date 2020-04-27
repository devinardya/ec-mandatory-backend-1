import React, {useEffect, useState, useRef} from 'react';
import io from 'socket.io-client';
import {updateUser, updateCurrentRoom, getChatHistory, getIncomingUser, getNewMessages} from '../socket';
import { IoIosAddCircleOutline, IoMdLogOut} from 'react-icons/io'
import '../Chat/chat.scss';
import { Redirect } from 'react-router-dom';

let socket; 

const Chat = ({location}) => {

    const [input, updateInput] = useState("");
    const [messages, updateMessages] = useState([]);
    const [room, updateRoom] = useState('general');
    const [chatRooms, updateChatRooms] =  useState([]);
    const [users, updateUsers] = useState([]);
    const [loginStatus, updateLoginStatus] = useState(true);
    let name = location.state.user;
    const chatWindow = useRef(null);
    const PORT = 'localhost:3000';
  
   
    // useEffect for joining
    useEffect( () => {
        socket = io(PORT)
        console.log("1. Joining")
 
        // Emitting to the server, which user and room to join
        socket.emit('join', {name, room});

    }, [PORT, name, room]);

    useEffect( () => {

        updateUser( socket, (err, userlist) => {
            console.log(userlist)
            updateUsers(userlist);
        });

        updateCurrentRoom( socket, (err, current_room) => {
            console.log("update room", current_room);
            updateChatRooms(current_room)
            });

        getChatHistory( socket, (err, chatHistory) => {
            console.log("savedMessage", chatHistory);
            updateMessages(chatHistory); 
        });

    }, [])

 

    useEffect(() => {
        console.log("INCOMING USER")
        getIncomingUser( socket, (err, data) => {
            console.log(data);
            let message = data;
            let copyMessage = [...messages];		
            updateMessages([...copyMessage, message]);
        });
    }, [messages])


    const scrollToBottom = () => {
        const scrollHeight = chatWindow.current.scrollHeight;
        chatWindow.current.scrollTop = scrollHeight;
    }
    
    useEffect(scrollToBottom, [messages]);


    useEffect( () => {
        console.log("getting new mesasage from the server")
        
        getNewMessages(socket, (err, data) => {
            console.log("new_message", data);
            let message = data;
            let copyMessage = [...messages];		
            updateMessages([...copyMessage, message]);
        })
    }, [messages]) 


    const onChange = (e) => {
        let value = e.target.value;
        updateInput(value);
    }

    // sending message
    const onSubmit = (e) => {
        e.preventDefault();
   
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
                        {users.map(user => {
                            //console.log(user)
                            return <p key={user.id}>{user.name}</p>
                        })}
                    </div>
                    <div className="block__chatPage__sidebar--roomlist">
                        <h3>Room list</h3>
                        <button><IoIosAddCircleOutline size="24px"/></button>
                        {chatRooms.map(room => {
                            //console.log(room)
                            return <p key={room.id}>{room.room}</p>
                        })
                        }
                    </div>
                    <div className="block__chatPage__sidebar--logoutButton">
                        <button onClick={logout}>
                            <IoMdLogOut className="block__chatPage__sidebar--logoutButton--icon" size="20px"/>
                            Log out
                        </button>
                    </div>
                </div>
                <div className="block__chatPage__mainbar">
                    <div className="block__chatPage__mainbar--chatbox" ref={chatWindow}  >
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