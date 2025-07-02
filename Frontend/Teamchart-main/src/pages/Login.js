// import React, { useState } from 'react';
// import api from '../api';

// function Login({ onLogin }) {
//     //abhay
//     const [form, setForm] = useState({ username: '', password: '' });
//     const [error, setError] = useState('');

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             console.log(form)
//             const res = await api.post('/auth/login', form);
//             onLogin(res.data); 
//             console.log(res.data)
//         } catch (err) {
//             setError('Login failed. Please check credentials.');
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <h2>Login</h2>
//             <input placeholder="Username" onChange={e => setForm({ ...form, username: e.target.value })} />
//             <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
//             <button type="submit">Login</button>
//             {error && <p style={{ color: 'red' }}>{error}</p>}
//         </form>
//     );
// }

// export default Login;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ import
import api from '../api';

function Login({ onLogin }) {
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate(); // ✅ hook to navigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', form);
            onLogin(res.data); 
            console.log('Login successful:', res.data);

            navigate('/home'); // ✅ redirect on success
        } catch (err) {
            setError('Login failed. Please check credentials.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input 
                placeholder="Username" 
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })} 
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} 
            />
            <button type="submit">Login</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
}

export default Login;
