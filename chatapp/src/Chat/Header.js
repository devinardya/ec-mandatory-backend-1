import React from 'react';
import '../Chat/chat.scss';
import logoIcon from '../Design/logo-lightbg.svg';


const Header = ({currentRoom, name, logout}) => {

    const onLogout = () => {
        logout();
    }

    return <header className="block__chatPage--header">
                <div className = "block__chatPage--header--logo">
                    <figure className="block__chatPage__header--image">
                        <img src={logoIcon} alt="kongko logo" />
                    </figure>
                </div>
                <div className="block__chatPage__header--userbox">
                    <h2 className="block__chatPage__header--userbox--user">Welcome, {name}</h2>
                    <span> || </span>
                    <h2 className="block__chatPage__header--userbox--room">
                        <span>Room: </span>
                        {currentRoom}</h2>
                    <span> || </span>
                    <button onClick={onLogout}>
                        Log out
                    </button>
                </div>
            </header>
}

export default Header;