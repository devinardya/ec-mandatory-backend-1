import React from 'react';
import uuid from 'react-uuid';
import { IoIosContact} from 'react-icons/io';
import '../Chat/chat.scss';


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
                    let pointKey;
                    let boxClassName;
                   
                    if (data.username === name){
                        pointKey = "messages-"+ uuid();
                        boxClassName = "block__chatPage__mainbar--chatbox--message--sender"
                        
                        return <div className={boxClassName} key={pointKey}>
                                    {activeUserNow.find(y => y === data.username)
                                        ? <span className="block__chatPage__mainbar--chatbox--message--image--active">< IoIosContact size="35px" color="white"/></span>
                                        : <span className="block__chatPage__mainbar--chatbox--message--image">< IoIosContact size="35px" color="white"/></span>
                                    }        
                                
                                    <div className="block__chatPage__mainbar--chatbox--message--blockText">
                                        <p className="block__chatPage__mainbar--chatbox--message--username">{data.username}</p>
                                        <p className="block__chatPage__mainbar--chatbox--message--text">{data.content}</p>
                                    </div>
                                </div> 

                    } else if (data.username === "Admin"){
                        let checkMsg = data.content.includes(name)
                        if (!checkMsg) {
                            return <div className ="block__chatPage__mainbar--chatbox--message--admin" key= {data.id}>
                                        <div className="block__chatPage__mainbar--chatbox--message--blockText" >
                                            <p className="block__chatPage__mainbar--chatbox--message--text">{data.content}</p>
                                        </div>
                                </div>
                        } else {
                            return null;
                        }
                        
                    } else {
                        pointKey = data.id;
                        boxClassName = "block__chatPage__mainbar--chatbox--message--incoming"
                        return <div className={boxClassName} key={pointKey}>
                                    {activeUserNow.find(y => y === data.username)
                                        ? <span className="block__chatPage__mainbar--chatbox--message--image--active">< IoIosContact size="35px" color="white"/></span>
                                        : <span className="block__chatPage__mainbar--chatbox--message--image">< IoIosContact size="35px" color="white"/></span>
                                    }        
                                
                                    <div className="block__chatPage__mainbar--chatbox--message--blockText">
                                        <p className="block__chatPage__mainbar--chatbox--message--username">{data.username}</p>
                                        <p className="block__chatPage__mainbar--chatbox--message--text">{data.content}</p>
                                    </div>
                                </div> 
                    }
                      
                      
                })
                : null
                } 
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