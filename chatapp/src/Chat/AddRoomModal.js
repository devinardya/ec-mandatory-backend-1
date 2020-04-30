import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import '../Chat/addroommodal.scss'
import { Redirect } from 'react-router-dom';



const AddRoomModal = ({name, socket, updateAddingRoomStatus}) => {

    const [inputValue, updateInputValue] = useState("");
    const [modalStatus, updateModalStatus] = useState(true)
    const [errorStatus, updateErrorStatus] = useState(false)
    
    const onChange = (e) => {
        let value = e.target.value;
        updateInputValue(value);
    }

    const onSubmit = (e) => {
        e.preventDefault();

        let room= inputValue
        socket.emit('addingRoom', {name, room}, (error) => {
            if(error) {
                console.log(error);
                updateErrorStatus(true)
            }
        updateInputValue("");
        updateModalStatus(false)
        });
    }

    const closeModal = () => {
        updateAddingRoomStatus(false)
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
                <h2>Create new room</h2>
                <form onSubmit={onSubmit}>
                    <input type="text" value={inputValue} placeholder="Enter new room" onChange={onChange} />
                    {errorStatus ? <p>alert text would be here</p> : <p></p>}
                    <div className = "block__chatPage__sidebar--roomlist--modal--buttons">
                        <span onClick = {closeModal}>Close</span>
                        <button>Create</button>
                    </div>
                </form>
            </div>
        </div>
        ,
		document.body
	);
};

export default AddRoomModal;