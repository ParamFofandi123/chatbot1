import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Signup } from './components/Signup/Signup';
import {Login} from './components/Login/Login';
import {Chatbot} from './components/Chatbot/Chatbot';
// import "./App.css"



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chatbot" element={<Chatbot />} />
        
      </Routes>
    </Router>
  );
}

export default App;
