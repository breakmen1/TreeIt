import React, { useState } from 'react';
import api from '../components/BaseAPI';
import { Link } from 'react-router-dom';
import registerImage from '../images/Register.gif'; // adjust path if in another folder
import "../style/Register.css";

function Register() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    name: '',
    role: 'USER',
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      setMessage('Registration successful. Please register.');
    } catch {
      setMessage('Registration failed. Try a different username.');
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-right">
        <img src={registerImage} alt="register Visual" className="register-image" />


        <h3>Break It! <b>To Build It</b></h3>
        <p>Visual task management tool</p>
      </div>
      <div className="register-left">
        <div className="register-logo">Tree It</div>
        <h2 className="register-welcome">Hello there!</h2>
        <p className="register-subtext">Please enter your register details below</p>
        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="register-input"
          />
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="register-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="register-input"
          />
          <select
            onChange={e => setForm({ ...form, role: e.target.value })}
            className="register-select"
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>

          <button className="register-button" type="submit">
            register
          </button>
          {message && <p className="register-message">{message}</p>}

          <p className="signup-prompt">
            Already have an account? <a href="/login">Sign In</a>
          </p>
        </form>
      </div>


    </div>
  );
}

export default Register;
