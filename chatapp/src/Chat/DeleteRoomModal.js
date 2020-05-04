import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import '../Chat/roomModal.scss'
import { Redirect } from 'react-router-dom';



const DeleteRoomModal = ({
        socket,
        updateDeleteRoomStatus,
        eachRoom,
        rooms,
        name, 
        updateChatRooms,
        updateRoom,
        currentRoom, 
        chatRooms
}) => {

  
    const [modalStatus, updateModalStatus] = useState(true)


    const onRemoveRoom = (roomId, room, userId) => {
        
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

        updateDeleteRoomStatus(false);
        updateModalStatus(false);

        if(room === currentRoom) {
            updateRoom("General");
        }
    }

    const closeModal = () => {
        updateDeleteRoomStatus(false);
        updateModalStatus(false);
    }

    if (!modalStatus) {
        return <Redirect to={{
                    pathname: "/chat",
                    state: { user: name }
                }}
            /> 
    }


    return ReactDOM.createPortal(
        <div className="block__chatPage__sidebar--roomlist--modal">
            <div className="block__chatPage__sidebar--roomlist--modal--formcontainer">
                <h2>Delete room</h2>
                <div className="block__chatPage__sidebar--roomlist--modal--div">
                   <span className = "block__chatPage__sidebar--roomlist--modal--formcontainer-span">
                       Are you sure you want to delete <span className ="text-span">"{eachRoom.usersroom}"</span>
                    </span>
                    <div className = "block__chatPage__sidebar--roomlist--modal--buttons">
                        <span onClick = {closeModal}>Cancel</span>
                        <button onClick={() => onRemoveRoom(eachRoom.id, eachRoom.usersroom, rooms.id)}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
        ,
		document.body
	);
};

export default DeleteRoomModal;