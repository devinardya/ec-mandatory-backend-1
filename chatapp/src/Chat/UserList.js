import React from 'react';
import { IoIosContact} from 'react-icons/io';
import '../Chat/chat.scss';

const UserList = ({
            currentRoom,
            activeUserNow,
            users
}) => {

    return <>
            <h3>Users</h3>
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
           </>
}

export default UserList;