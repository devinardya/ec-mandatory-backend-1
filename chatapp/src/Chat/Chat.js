import React, {useEffect, useState, useRef} from 'react';
import io from 'socket.io-client';
import AddRoomModal from '../Chat/AddRoomModal';
import {updateUser, updateCurrentRoom, getChatHistory, getStatusUser, getNewMessages, getActiveUsers, getAllRoomsList} from '../socket';
import { IoIosAddCircleOutline, IoMdLogOut, IoIosContact, IoIosChatbubbles} from 'react-icons/io';
import {TiDelete} from 'react-icons/ti';
import '../Chat/chat.scss';
import { Redirect} from 'react-router-dom';


let socket; 

const Chat = ({location}) => {

    const [input, updateInput] = useState("");
    const [messages, updateMessages] = useState([]);
    const [currentRoom, updateRoom] = useState("General");
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
            let message = data;
            let copyMessage = [...messages];		
            updateMessages([...copyMessage, message]);
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

    const onAddingRoom = () => {
        
        updateAddingRoomStatus(true);
        console.log(addingRoomStatus)
    }

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
       
    }
 
// ADDING & SENDING NEW MESSAGES TO SERVER ===============================================

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

    return <div className="block__chatPage">
                <div className="block__chatPage__sidebar">
                    <div className="block__chatPage__sidebar--userbox">
                        <h2>Welcome, {name}</h2>
                    </div>
                    <div className="block__chatPage__sidebar--userlist">
                        <ul>
                        {users.map(user => {
                            //console.log("USER", user)
                            let printUserList;
                            if(user.usersroom === currentRoom){
                                //console.log("ACTIVE USER IN CURRENT ROOM",activeUserNow, currentRoom)
                                printUserList = user.username.map(eachUser => {
                                                    //console.log("eachUser", eachUser)
                                                    return (<li key={eachUser.id} className="block__chatPage__sidebar--userlist--box">
                                                                {activeUserNow.some(x => x.username === eachUser.username)
                                                                ? <span className="block__chatPage__sidebar--userlist--box--dot--active">< IoIosContact size="40px" color="white"/></span>
                                                                : <span className="block__chatPage__sidebar--userlist--box--dot">< IoIosContact size="40px" color="white"/></span>}
                                                                <p>{eachUser.username}</p>
                                                            </li>)
                                                })
                            }

                            return printUserList;
                        })}
                        </ul>
                    </div>
                    <div className="block__chatPage__sidebar--roomlist">
                        <div className="block__chatPage__sidebar--roomlist--title">
                            <h3>Room list</h3>
                            <button onClick = {onAddingRoom}><IoIosAddCircleOutline size="24px"/></button>
                            { addingRoomStatus && <AddRoomModal name = {name} 
                                                                socket = {socket}
                                                                updateAddingRoomStatus = {updateAddingRoomStatus}
                                                />}
                        </div>
                        
                        <ul>
                            {chatRooms.map(rooms => {
                                //console.log("CHATROOM", rooms)
                                let printList;
                                if (rooms.username === name){

                                printList = rooms.usersroom.map( eachRoom => {
                                    //console.log("the rooms in usersroom", eachRoom.usersroom, currentRoom)
                                    let activeRoom;
                                    if(eachRoom.usersroom === currentRoom){
                                        activeRoom = "block__chatPage__sidebar--roomlist--roomsButton--active";
                                    } else if (eachRoom.usersroom !== currentRoom){
                                        activeRoom = "block__chatPage__sidebar--roomlist--roomsButton";
                                    }

                                    return <li key={eachRoom.id} className= "block__chatPage__sidebar--roomlist--room">
                                                <button onClick={ () => switchRoom(eachRoom.usersroom)}>
                                                    <span className= {activeRoom}>
                                                        <IoIosChatbubbles size="22px"/>
                                                    </span>
                                                    <span className = "block__chatPage__sidebar--roomlist--roomsText">
                                                        {eachRoom.usersroom}
                                                    </span>
                                                </button>
                                                {eachRoom.usersroom === "General" ? null : <span onClick ={() => removeRoom(eachRoom.id, eachRoom.usersroom, rooms.id)} className="block__chatPage__sidebar--roomlist--room--delete"><TiDelete size="24px" /></span>}
                                            </li>;
                                    })
                                }
                                return printList;
                            })
                            }
                        </ul>
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
                            console.log(data)
                            let pointKey;
                            let boxClassName;
                            if (data.username === name){
                                pointKey = "messages-"+ Math.round(Math.random() * 99999999999);
                                boxClassName = "block__chatPage__mainbar--chatbox--message--sender"
                            } else if (data.username === "Admin"){
                                pointKey = data.id;
                                boxClassName = "block__chatPage__mainbar--chatbox--message--admin"
                            } else {
                                pointKey = data.id;
                                boxClassName = "block__chatPage__mainbar--chatbox--message--incoming"
                            }
                            //console.log(data)
                            return <div className={boxClassName} key={pointKey}>
                                        {activeUserNow.find(x => x === data.username)
                                         ? <span className="block__chatPage__mainbar--chatbox--message--image--active">< IoIosContact size="35px" color="white"/></span>
                                         : <span className="block__chatPage__mainbar--chatbox--message--image">< IoIosContact size="35px" color="white"/></span>}        
                                        {/* <span className="block__chatPage__mainbar--chatbox--message--image">< IoIosContact size="35px" color="white"/></span> */}
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