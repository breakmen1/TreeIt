// import React from "react";
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from "./pages/Home";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AnimatePresence } from "framer-motion";


function App() {
  const [user, setUser] = useState(null);
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/Login" element={<Login onLogin={setUser} />} />
        <Route path="/" element={<Register />} />
        <Route path="/dashboard" element={<div>Welcome, {user?.username}</div>} />
      </Routes>
      <ToastContainer
        position="top-right" autoClose={3000} />
    </AnimatePresence>
  );
}

export default App;