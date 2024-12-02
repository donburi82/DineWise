import React from 'react';
import { Link } from 'react-router-dom';

function Welcome() {
  return (
    <div style={{display:'flex', flexDirection: 'column', alignItems:'center'}}>
        <div style={{marginTop:200}}>
            <h1> Welcome to DineWise</h1>
        </div>
        <nav>
            <Link to="/login"> Login</Link>
        </nav>
        <nav>
            <Link to="/signUp"> Sign Up</Link>
        </nav>

    </div>
  );
}

export default Welcome;
