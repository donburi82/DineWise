import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Welcome from './Pages/Welcome'
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'


function App() {
  return (
   <BrowserRouter>
    <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
    </Routes>
   </BrowserRouter>
  );
}

export default App;
