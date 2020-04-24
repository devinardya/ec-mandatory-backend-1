import React from 'react';
import { Route, BrowserRouter as Router } from "react-router-dom";
import Chat from './Chat/Chat';
import Login from './Login/Login'
import './App.scss';

function App() {
  return (
    <div className="App">
      <Router>
        <Route path="/chat" component={Chat} />
        <Route exact path="/" component={Login} />
      </Router>
    </div>
  );
}

export default App;
