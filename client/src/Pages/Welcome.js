import React from 'react';
import { Link } from 'react-router-dom';

function Welcome() {
  return (
    <>
        <nav>
            <Link to="/login"> Login</Link>
            <Link to="/signUp"> Sign Up</Link>
        </nav>
        <div>
            <h1> Welcome to DineWise</h1>
        </div>
    </>
  );
}

export default Welcome;
