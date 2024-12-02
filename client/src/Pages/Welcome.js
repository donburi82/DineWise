import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Welcome() {
  const navigate = useNavigate();
  function login() {
    navigate('/login');
  }
  function signUp() {
    navigate('/signup');
  }

  return (
    <div style={{display:'flex', flexDirection: 'column', alignItems:'center'}}>
        <div style={{marginTop:200}}>
            <h1> Welcome to DineWise</h1>
        </div>
        <div>
        <button onClick={login} style={{margin:20, padding:10, fontSize:20, color: 'white', backgroundColor: 'gray', border:1,  borderRadius:12}}>Login</button>
        <button onClick={signUp} style={{margin:20, padding:10, fontSize:20, border:1, borderRadius:12}}>Sign up</button>
        </div>
    </div>
  );
}

export default Welcome;
