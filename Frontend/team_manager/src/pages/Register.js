import React, { useState } from 'react';
import api from '../api';

function Register() {
    const [form, setForm] = useState({ username: '', password: '', name: '', role: 'USER' });
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(form);
            await api.post('/auth/register', form);
            setMessage('Registration successful. Please login.');
        } catch {
            setMessage('Registration failed. Try a different username.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Username" onChange={e => setForm({ ...form, username: e.target.value })} />
            <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
            <select onChange={e => setForm({ ...form, role: e.target.value })}>
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
            </select>
            <button type="submit">Register</button>
            <p>{message}</p>
        </form>
    );
}

export default Register;