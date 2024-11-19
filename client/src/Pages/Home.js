import React from 'react';
import {useState} from 'react';
import './Home.css';
import {useNavigate, useLocation} from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const jwt = location.state;
  return (
    <>
     <div style={{display:"flex", flexDirection: "column", alignItems:"left", margin:"20px"}}>
     <h1> HOME </h1>
     <p>{JSON.stringify(jwt)} </p>
     </div>
    </>
  );
}

export default Home;
