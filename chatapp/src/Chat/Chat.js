import React, {useEffect, useState, useRef} from 'react';
import io from 'socket.io-client';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Redirect} from 'react-router-dom';
import {updateUser, updateCurrentRoom, getChatHistory, getStatusUser, getNewMessages, getActiveUsers, getAllRoomsList} from '../socket';
import '../Chat/chat.scss';
import Chatbox from '../Chat/Chatbox';
import RoomList from '../Chat/RoomList';
import UserList from '../Chat/UserList';
import Header from '../Chat/Header';


let socket; 
let defaultRoom = "General";

const Chat = ({location}) => {

    const [input, updateInput] = useState("");
    const [messages, updateMessages] = useState([]);
    const [currentRoom, updateRoom] = useState(defaultRoom);
    const [chatRooms, updateChatRooms] =  useState([]);
    const [activeUserNow, updateActiveUsersNow] = useState([])
    const [users, updateUsers] = useState([]);
    const [loginStatus, updateLoginStatus] = useState(true);
    const [addingRoomStatus, updateAddingRoomStatus] = useState(false);
    let name = location.state.user;
    const chatWindow = useRef(null);
    const PORT = 'localhost:3000';
    
// SENDING JOINED ROOM & USER NAME TO SERVER ===============================================

    useEffect( () => {
        // Starting a socket for the user
        socket = io(PORT);
      
        console.log("0.setting socket");
    }, [PORT]);

 

    useEffect( () => {
        console.log("1. Joining a channel")
        let room = currentRoom;
        console.log(room)

        socket.emit('join', {name, room});
        
    }, [name, currentRoom]);

// GETTING USER DATA, CHAT HISTORY, CURRENT ROOM DATA FROM SERVER ===============================================

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

    }, [currentRoom])

// GETTING ACTIVE USER DATA FROM SERVER ===============================================

    useEffect( () => {
        console.log("ACTIVE USER")
        getActiveUsers(socket, (err, data) => {
            console.log("active users now", data)
            updateActiveUsersNow(data)
        })
    }, [])

// GETTING INCOMING USER DATA FROM SERVER ===============================================

    useEffect(() => {
        console.log("STATUS USER")
        //console.log(messages)
        getStatusUser( socket, (err, data) => {
            //console.log(data);
           /*  let message = data;
            let copyMessage = [...messages];	 
            updateMessages([...copyMessage, message]); */
            updateMessages(data);
        });
    }, [messages])

// ADDING SCROLL TO BOTTOM ===============================================

    const scrollToBottom = () => {
        const scrollHeight = chatWindow.current.scrollHeight;
        chatWindow.current.scrollTop = scrollHeight;
    }
    
    useEffect(scrollToBottom, [messages]);

// GETTING NEW MESSAGES FROM SERVER ===============================================

    useEffect( () => {
        console.log("getting new mesasage from the server")
        
        getNewMessages(socket, (err, data) => {
            console.log("new_message", data);
      /*       let message = data;
            let copyMessage = [...messages];	
        //copyMessage.splice(0, 1);	
        updateMessages([...copyMessage, message]); */
            updateMessages(data);
        })
    }, [messages]);
    
// ADDING NEW ROOMS ===============================================


    useEffect( () => {
        console.log("GETTING ALL CHAT ROOM")
        getAllRoomsList(socket, (err, data) => {
            console.log("all chat rooms", data)
            updateChatRooms(data)
        })
    }, [])

    const switchRoom = (newRoom) => {
        let room = currentRoom;
        let currentActiveUser = [...activeUserNow];
        if(newRoom !== room){
            socket.emit('leave', {name, room, currentActiveUser});
            updateRoom(newRoom)
        }
    };

// REMOVING ROOMS ===============================================

    const removeRoom = (roomId, room, userId) => {

        console.log("REMOVE ROOM")
        let copyData = [...chatRooms];
        console.log("USERID", userId)

        socket.emit('remove_room', ({name, room, roomId, userId}))
        
        let removeData = copyData.map( eachChatRoom => {
            
           if(eachChatRoom.username === name) {
               console.log("username match")
                const listIndex = eachChatRoom.usersroom.findIndex (x => x.id === roomId);
                console.log(listIndex)
                let copyDataChatRoom = [...eachChatRoom.usersroom]
                copyDataChatRoom.splice(listIndex, 1)
                console.log("result", copyDataChatRoom)
                eachChatRoom.usersroom = copyDataChatRoom;
            }

            return eachChatRoom;
        });
        console.log(removeData)
        updateChatRooms(removeData) 

        if(room === currentRoom) {
            updateRoom("General");
        }
       
    }
 
// ADDING & SENDING NEW MESSAGES TO SERVER ===============================================

    const onChange = (value) => {
        //let value = e.target.value;
        updateInput(value);
    }

    // sending message
    const onSubmit = (input) => {
        //e.preventDefault();
   
        socket.emit("new_message",{
            username: name,
            content: input,
            chatRoom: currentRoom
        })
        updateInput("");
        let message = {username: name, content: input};
        let copyMessage = [...messages];	
        //copyMessage.splice(0, 1);	
        updateMessages([...copyMessage, message]);
    }

// LOG OUT FROM CHAT APP ===============================================

    const logout = () => {
        let room = currentRoom;
        socket.emit('leave', {name, room});
        socket.close();
        console.log("DISCONNECTED")
        updateLoginStatus(false);
        
    }

    if (!loginStatus) {
        return <Redirect to="/"/>
    }

    return <HelmetProvider>
                <Helmet>
                    <title>Kongko Chat - {currentRoom}</title>
                </Helmet>
                <div className="block__chatPage">
                    <Header
                        currentRoom = {currentRoom}
                        name = {name}
                        logout = {logout} 
                    />
                    <main className="block__chatPage--main">
                        <div className="block__chatPage__sidebar">
                            <div className="block__chatPage__sidebar--userlist">
                                <UserList 
                                    currentRoom = {currentRoom}
                                    users = {users}
                                    activeUserNow = {activeUserNow}
                                />
                            </div>
                            <div className="block__chatPage__sidebar--roomlist">
                                <RoomList 
                                    chatRooms = {chatRooms}
                                    name = {name}
                                    currentRoom = {currentRoom}
                                    switchRoom = {switchRoom}
                                    removeRoom = {removeRoom}
                                    socket = {socket}
                                    updateAddingRoomStatus = {updateAddingRoomStatus}
                                    addingRoomStatus = {addingRoomStatus}
                                />
                            </div>
                            
                        </div>
                        <div className="block__chatPage__mainbar">
                            <Chatbox 
                                onSubmit = {onSubmit}
                                messages = {messages}
                                onChange = {onChange}
                                input = {input}
                                chatWindow = {chatWindow}
                                name = {name}
                                activeUserNow = {activeUserNow}
                            />
                        </div>
                    </main>
                </div>
            </HelmetProvider>
}

export default Chat;