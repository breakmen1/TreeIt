import React, { useState } from 'react';
import api from '../components/utility/BaseAPI';
import { Link, redirect } from 'react-router-dom';
import registerImage from '../images/Register.gif'; // adjust path if in another folder
import "../style/Register.css";
import PageWrapper from "../components/ui/PageWrapper";
import { useNavigate } from 'react-router-dom';
import { showError, showSuccess, showInfo } from "../components/utility/ToastNotofication";



function Register() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    name: '',
    role: 'USER',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', form);
      if (res.data == "Mail already exists" || res.data == "Employee ID already exists" || res.data == "Username already exists") {
        showInfo(res.data);
      } else {
        showSuccess(res.data);
        navigate('/login');
      }
    } catch {
      showError('Registration failed, Srever busy');
    }
  };

  return (
    <PageWrapper>
      <div className="register-wrapper font-poppins">
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
              placeholder="mail"
              value={form.mail}
              onChange={(e) => setForm({ ...form, mail: e.target.value })}
              className="register-input"
            />
            <input
              type="text"
              placeholder="employee no"
              value={form.employeeId}
              onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
              className="register-input"
            />
            <input
              type="text"
              placeholder="username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="register-input"
            />
            <input
              type="password"
              placeholder="password"
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
              Register
            </button>
            {message && <p className="register-message">{message}</p>}

            <p className="signup-prompt">
              Already have an account? <a href="/login">Sign In</a>
            </p>
          </form>
        </div>


      </div>
    </PageWrapper>
  );
}

export default Register;
