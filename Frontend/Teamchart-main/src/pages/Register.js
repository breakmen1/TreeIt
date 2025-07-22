import React, { useState } from 'react';
import api from '../components/BaseAPI';
import { Link } from 'react-router-dom'; // ✅ import

function Register() {
  const [form, setForm] = useState({ username: '', password: '', name: '', role: 'USER' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      setMessage('Registration successful. Please login.');
    } catch {
      setMessage('Registration failed. Try a different username.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-[300px] mx-auto mt-20 space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

      <input
        placeholder="Name"
        onChange={e => setForm({ ...form, name: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <input
        placeholder="Username"
        onChange={e => setForm({ ...form, username: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        onChange={e => setForm({ ...form, password: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <select
        onChange={e => setForm({ ...form, role: e.target.value })}
        className="w-full p-2 border rounded"
      >
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
      </select>

      <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Register
      </button>

      <p className="text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-500 hover:underline">
          Login here
        </Link>
      </p>

      {message && <p className="text-center text-sm mt-2">{message}</p>}
    </form>
  );
}

export default Register;