// import React from "react";
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from "./pages/Home";
function App() {
  const [user, setUser] = useState(null);
  return (
    <Routes>
      <Route path="/Home" element={<Home />} />
      <Route path="/Login" element={<Login onLogin={setUser} />} />
      <Route path="/" element={<Register />} />
      <Route path="/dashboard" element={<div>Welcome, {user?.username}</div>} />
    </Routes>
  );
}

export default App;
