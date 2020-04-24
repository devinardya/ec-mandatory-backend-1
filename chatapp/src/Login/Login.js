import React, {useState} from 'react';
import { Redirect } from 'react-router-dom';
import '../Login/login.scss';
import { AiFillWechat } from "react-icons/ai";


const Login = () => {

    const [username, updateUsername] = useState("");
    const [status, updateStatus] = useState(false);
    const [name, updateName] = useState("");

    const onChange = (e) => {
        let value = e.target.value;
        updateUsername(value);
    }

    const onSubmit = (e) => {
        e.preventDefault();

        updateStatus(true);
        updateName(username);
        updateUsername("");
    }

    if(status) {
        return <Redirect to={{
                pathname: '/chat',
                state: { user: name }
            }}
        />
    }; 


    return <div className = "block__loginPage">
                <form className = "block__loginPage--form" onSubmit= {onSubmit}>
                    <div className="block__loginPage--form-top">
                        <span className="block__loginPage--login-icon"><AiFillWechat className ="icons" size="60px" color="white" /></span> 
                        <h3>Welcome!</h3>
                        <h5>Please log in to join the chat room!</h5>
                    </div>
                    <div className="block__loginPage--form-bottom">
                        <input className="block__loginPage--input-box" type="text" placeholder="Username" onChange={onChange} value={username}/>
                    </div>
                    <button className="block__loginPage--login-button">Enter chat</button>
                </form>
            </div>
}

export default Login;