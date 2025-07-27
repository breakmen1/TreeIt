import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../components/BaseAPI";
import "../style/Login.css";
import loginImage from '../images/Login.gif';


function Login({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      if (res.status === 200 && typeof res.data === "number") {
        localStorage.setItem("memberId", res.data);
        localStorage.setItem("username", form.username);
        onLogin(res.data);
        navigate("/home");
      } else {
        setError("Unexpected response from server.");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid username or password");
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <div className="login-logo">Tree It</div>
        <h2 className="login-welcome">Welcome Back!</h2>
        <p className="login-subtext">Please enter your login details below</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="login-input"
          />
          <div className="login-actions">
            <span className="forgot-password">Forgot password?</span>
          </div>
          <button className="login-button" type="submit">
            Login
          </button>
          {error && <p className="login-error">{error}</p>}
          <p className="signup-prompt">
            Don't have an account? <a href="/">Sign Up</a>
          </p>
        </form>
      </div>

      <div className="login-right">
        <img src={loginImage} alt="Login Visual" className="login-image" />


        <h3>Break It! <b>To Build It</b></h3>
        <p>Visual task management tool</p>
      </div>
    </div>
  );
}

export default Login;
