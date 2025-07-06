import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './Login.css'; // ✅ Import the CSS file

function Login({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', form);
      onLogin(res.data);
      navigate('/home');
    } catch (err) {
      setError('Login failed. Please check credentials.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>
        <input
          className="login-input"
          placeholder="Username"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <button className="login-button" type="submit">Login</button>
        {error && <p className="login-error">{error}</p>}
      </form>
    </div>
  );
}

export default Login;
