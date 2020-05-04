import React from 'react';
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

                    console.log(data)
                    console.log('current name ', name)
                    let pointKey;
                    let boxClassName;
                   /*  let printData;
                    
                    printData = <div className={boxClassName} key={pointKey}>
                                        {activeUserNow.find(y => y === data.username)
                                            ? <span className="block__chatPage__mainbar--chatbox--message--image--active">< IoIosContact size="35px" color="white"/></span>
                                            : <span className="block__chatPage__mainbar--chatbox--message--image">< IoIosContact size="35px" color="white"/></span>
                                        }        
                                    
                                        <div className="block__chatPage__mainbar--chatbox--message--blockText">
                                            <p className="block__chatPage__mainbar--chatbox--message--username">{data.username}</p>
                                            <p className="block__chatPage__mainbar--chatbox--message--text">{data.content}</p>
                                        </div>
                                    </div>  */

                        if (data.username === name){
                            pointKey = "messages-"+ Math.round(Math.random() * 99999999999);
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
                            //pointKey = data.id;
                            console.log("ITS ADMIN")
                            //boxClassName = "block__chatPage__mainbar--chatbox--message--admin"
                            let checkMsg = data.content.includes(name)
                            if (!checkMsg) {
                                console.log("NOT USER")
                                return <div className ="block__chatPage__mainbar--chatbox--message--admin" key= {data.id}>
                                            <div className="block__chatPage__mainbar--chatbox--message--blockText" >
                                                <p className="block__chatPage__mainbar--chatbox--message--text">{data.content}</p>
                                            </div>
                                    </div>
                            } else {
                                console.log("USER")
                                return null;
                            }
                            
                        } else {
                            console.log("PRINT THIS TOO")
                            console.log('my data', data)
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
                        //console.log(data)
                      
                })
                : null
                } 
                {/* {adminMsg.map( data => {
                        let checkMsg = data.content.includes(name)
                        if (!checkMsg) {
                            return <div className ="block__chatPage__mainbar--chatbox--message--admin">
                                        <div className="block__chatPage__mainbar--chatbox--message--blockText" key= {data.id}>
                                            <p className="block__chatPage__mainbar--chatbox--message--text">{data.content}</p>
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