import React from 'react';
import { IoIosAddCircleOutline,IoIosChatbubbles} from 'react-icons/io';
import {TiDelete} from 'react-icons/ti';
import '../Chat/chat.scss';
import AddRoomModal from '../Chat/AddRoomModal';
import DeleteRoomModal from './DeleteRoomModal';




const RoomList = ({
                    chatRooms,
                    name,
                    currentRoom,
                    switchRoom,
                    socket,
                    updateAddingRoomStatus,
                    addingRoomStatus,
                    updateDeleteRoomStatus,
                    deleteRoomStatus,
                    updateChatRooms,
                    updateRoom
                }) => {

        const onSwitchRoom = (newRoom) => {
            switchRoom(newRoom)
        }

        const onAddingRoom = () => {
        
            updateAddingRoomStatus(true);
           // console.log(addingRoomStatus)
        }

        const onDeleteRoom = () => {
            updateDeleteRoomStatus(true)
        }

    return <>
            <div className="block__chatPage__sidebar--roomlist--title">
                <h3>Rooms</h3>
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
                                    <button onClick={ () => onSwitchRoom(eachRoom.usersroom)}>
                                        <span className= {activeRoom}>
                                            <IoIosChatbubbles size="22px"/>
                                        </span>
                                        <span className = "block__chatPage__sidebar--roomlist--roomsText">
                                            {eachRoom.usersroom}
                                        </span>
                                    </button>
                                    {/* {eachRoom.usersroom === "General" ? null : <span onClick ={() => onRemoveRoom(eachRoom.id, eachRoom.usersroom, rooms.id)} className="block__chatPage__sidebar--roomlist--room--delete"><TiDelete size="24px" /></span>} */}
                                    {eachRoom.usersroom === "General" ? null : 
                                    <span onClick ={onDeleteRoom} className="block__chatPage__sidebar--roomlist--room--delete"><TiDelete size="24px" /></span>}
                                    { deleteRoomStatus && <DeleteRoomModal socket = {socket}
                                                                           updateDeleteRoomStatus = {updateDeleteRoomStatus}
                                                                           eachRoom = {eachRoom}
                                                                           rooms = {rooms}
                                                                           currentRoom = {currentRoom}
                                                                           name = {name}
                                                                           updateChatRooms = {updateChatRooms}
                                                                           updateRoom = {updateRoom}
                                                                           chatRooms = {chatRooms}
                />}
                                </li>;
                        })
                    }
                    return printList;
                })
                }
            </ul>
           </>
}

export default RoomList;