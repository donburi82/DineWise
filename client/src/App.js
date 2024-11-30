import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Welcome from './Pages/Welcome';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Search from './Pages/Search';
import Recommendations from './Pages/Recommendations';
import SavedPlaces from './Pages/SavedPlaces';
import {AuthProvider} from './GlobalStates';

function App() {
  return (
   <BrowserRouter>
   <AuthProvider>
    <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/search" element={<Search />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/savedPlaces" element={<SavedPlaces />} />
    </Routes>
    </AuthProvider>
   </BrowserRouter>
  );
}

export default App;
