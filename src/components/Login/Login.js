import React, { useState } from 'react';
import axios from 'axios';

import "./Login.css"


export const Login = () => {


  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/login", {
        username,
        password,
      });
      setMessage(response.data.message);

      // Store username in localStorage
      localStorage.setItem("username", username);

      setUsername("");
      setPassword("");
      window.location.href = "/Chatbot";
    } catch (error) {
      setMessage(error.response.data.message || "An error occurred");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
           <title>Sign Up</title>
 
 <link rel="preconnect" href="https://fonts.gstatic.com" />
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
   <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;600&display=swap" rel="stylesheet" />
              <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
    </div>
      <h1>Login</h1>
      <form onSubmit={handleLogin} style={{ display: "inline-block", textAlign: "left" }}>
        <div>
          <label className='label2'>Studentname:</label>
          <input
          className='input-field1'
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label className='label2'>Password:</label>
          <input
          className='input-field1'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <p style={{paddingTop:"30px"}}>Create a new account <a href="/signup">here</a></p>
        <button className="submit-button1" type="submit">Login</button>
        
      </form>
      {message && <p style={{color:'white'}}>{message}</p>}
    </div>
  );
}

export default Login