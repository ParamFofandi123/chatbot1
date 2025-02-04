import React, { useState } from 'react';
import axios from 'axios';
import "./Signup.css"

export const Signup = () => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/signup', {
        username,
        email,
        password
      });

      setMessage(response.data.message);
      setUsername('');
      setEmail('');
      setPassword('');
      window.location.href = "/";

    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");
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
      <h1>Sign Up</h1>
      <form className="Form1" onSubmit={handleSignup} style={{ display: "inline-block", textAlign: "left" }}>
        <div>
          <label className='label1'>Username:</label>
          <input
            className='input-field'
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label className='label1'>Email:</label>
          <input
            className='input-field'
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className='label1'>Password:</label>
          <input
            className='input-field'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <p style={{ paddingTop: "30px" }}>Already have an account? login <a href="./">here</a></p>
        <button className="submit-button" type="submit">Sign Up</button>

      </form>
      {message && <p style={{ color: 'white' }}>{message}</p>}
    </div>


  )
}

export default Signup