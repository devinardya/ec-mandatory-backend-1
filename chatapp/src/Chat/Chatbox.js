import React from 'react';
import { IoIosContact} from 'react-icons/io';
import '../Chat/chat.scss';
import { TiChevronLeft } from 'react-icons/ti';


const Chatbox = ({onSubmit, messages, onChange, input, chatWindow, name, activeUserNow, adminMsg}) => {

    const onSendChange = (e) => {
        let value = e.target.value;
        onChange(value);
    }

    const onSendSubmit = (e) => {
        e.preventDefault();
        onSubmit(input)
    }

    return <>
            <div className="block__chatPage__mainbar--chatbox" ref={chatWindow}  >
                {messages.length !== 0 ? messages.map(data => {
                    console.log(data)
                    let pointKey;
                    let boxClassName;
                    if (data.username === name){
                        pointKey = "messages-"+ Math.round(Math.random() * 99999999999);
                        boxClassName = "block__chatPage__mainbar--chatbox--message--sender"
                    } /* else if (data.username === "Admin"){
                        pointKey = data.id;
                        boxClassName = "block__chatPage__mainbar--chatbox--message--admin"
                    }  */else {
                        pointKey = data.id;
                        boxClassName = "block__chatPage__mainbar--chatbox--message--incoming"
                    }
                    //console.log(data)
                    return <div className={boxClassName} key={pointKey}>
                                {activeUserNow.find(x => x === data.username)
                                    ? <span className="block__chatPage__mainbar--chatbox--message--image--active">< IoIosContact size="35px" color="white"/></span>
                                    : <span className="block__chatPage__mainbar--chatbox--message--image">< IoIosContact size="35px" color="white"/></span>
                                }        
                               
                                <div className="block__chatPage__mainbar--chatbox--message--blockText">
                                    <p className="block__chatPage__mainbar--chatbox--message--username">{data.username}</p>
                                    <p className="block__chatPage__mainbar--chatbox--message--text">{data.content}</p>
                                </div>
                            </div> 
                    })
                : null
                } 
                {/* {adminMsg.map( x => {
                        let checkMsg = x.content.includes(name)
                        if (!checkMsg) {
                            return <div className ="block__chatPage__mainbar--chatbox--message--admin">
                                        <div className="block__chatPage__mainbar--chatbox--message--blockText" key= {x.id}>
                                            <p className="block__chatPage__mainbar--chatbox--message--text">{x.content}</p>
                                        </div>
                                   </div>
                        } else {
                            return null;
                        }
                })} */}
            </div>
            <div className="block__chatPage__mainbar--form">
                <form onSubmit = {onSendSubmit}>
                    <input onChange={onSendChange} type="text" placeholder="Enter messages..." value={input}></input>
                    <button>Submit</button>
                </form>
            </div>
           </>
}

export default Chatbox;