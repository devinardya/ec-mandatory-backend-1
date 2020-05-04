import React, {useState} from 'react';
import { Redirect } from 'react-router-dom';
import '../Login/login.scss';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import logoIcon from '../Design/logo.svg';
import { MdCheckCircle, MdCancel } from "react-icons/md";
import { IoMdLogIn } from 'react-icons/io';

const Login = () => {

    const [username, updateUsername] = useState("");
    const [status, updateStatus] = useState(false);
    const [name, updateName] = useState(""); 

    const onChange = (e) => {
        let value = e.target.value.trim();
        updateUsername(value);
    }

   const onSubmit = (e) => {
        e.preventDefault();

        updateName(username);
        updateStatus(true);
        updateUsername("");
        
    }  

    const notSubmit = (e) => {
        e.preventDefault();
    }

     if(status) {
         return <Redirect to={{
                 pathname: "/chat",
                 state: { user: name}
              }}
                 /> 
    } 

    let warncolor;
    let warncolor2;
    let newcolor;
    let getSubmit;
    let validateIcon1;
    let validateIcon2;

    // validate input box for error input from user =========================================
    let regex = /[!"#€%&/()=?£$∞§≈±©~™…+^¨*':;.,$°§@[\]{}]/g;
    let notValidInput = regex.test(username);

    // if user enter a character that is not alphabet, numbers, empty space,  - or _ and left the input box empty or more than 12 characters
    // then the input is not valid. 
    if (username.length === 0 ) {
        warncolor = {color: "#ffbac9"};
        warncolor2 = {color: "#ffbac9"};
        newcolor = {color: "red"};
        getSubmit = notSubmit;
        validateIcon1 = <MdCancel className ="icons" size="12px" color="#ffbac9" />
        validateIcon2 = <MdCancel className ="icons" size="12px" color="#ffbac9" />
    } else if (username.length > 12 ) {
        warncolor = {color: "#ffbac9"};
        warncolor2 = {color: "#cbf7ed"};
        newcolor = {color: "red"};
        getSubmit = notSubmit;
        validateIcon1 = <MdCancel className ="icons" size="12px" color="#ffbac9" />
        validateIcon2 = <MdCancel className ="icons" size="12px" color="#cbf7ed" />
        //console.log("this is false")
    } else if (notValidInput){
        warncolor = {color: "#cbf7ed"};
        warncolor2 = {color: "#ffbac9"};
        newcolor = {color: "red"};
        getSubmit = notSubmit;
        validateIcon1 = <MdCancel className ="icons" size="12px" color="#cbf7ed" />
        validateIcon2 = <MdCancel className ="icons" size="12px" color="#ffbac9" />
        //console.log("notvalidinput")
    } else {
        warncolor = {color: "#cbf7ed"};
        warncolor2 = {color: "#cbf7ed"};
        newcolor = {color: "#252525"};
        getSubmit = onSubmit;
        validateIcon1 = <MdCheckCircle className ="icons" size="12px" color="#cbf7ed" />
        validateIcon2 = <MdCheckCircle className ="icons" size="12px" color="#cbf7ed" />
        //console.log("this is trueeee")
    }


    return <HelmetProvider>
                <Helmet>
                    <title>Kongko Chat - Login</title>
                </Helmet>
                <div className = "block__loginPage">
                    <div className = "block__loginPage--form">
                        <div className="block__loginPage--form-top">
                            <figure className="block__loginPage--form-top--logo">
                                <img src={logoIcon} alt="bercakap logo" />
                            </figure>
                            <h5>Welcome to Kongko. Please log in to continue</h5>
                        </div>
                        <form className="block__loginPage--form-bottom" onSubmit= {getSubmit} >
                                <input className="block__loginPage--input-box" style={newcolor} type="text" placeholder="Username" onChange={onChange} value={username}/>
                                <button className="block__loginPage--login-button"><IoMdLogIn className="block__loginPage--login-button--icons" size="40px"/></button> 
                        </form>
                        <div className = "block__loginPage--form--authorization">
                            <p className="block__loginPage--form--authorization__warning" style={warncolor} > {validateIcon1} Username have to be between 1 to 12 characters without empty space.</p>
                            <p className="block__loginPage--form--authorization__warning" style={warncolor2} > {validateIcon2} Username can only contains uppercase, lowercase, hypen (-), underscore (_), and numbers.</p>
                        </div>
                    </div>
                </div>
            </HelmetProvider>
}

export default Login;