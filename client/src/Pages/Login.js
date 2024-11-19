import  React from 'react';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    function loginDineWise() {
        if (email !== '' && password !== '') {
            const data = {email: email, password: password};
            //try login

            // if succeed
            navigate('/home', {state: {jwt: jwt}});

        }
    }

  return (
    <>
    <div style={{display:"flex", flexDirection: "column", alignItems:"left", margin:"20px"}}>
    <h1> Login</h1>

    <label> Email:
        <input className="textBox" value={email} onChange={e => setEmail(e.target.value)}/>
     </label>

     <label> Password:
         <input className="textBox" value={password} onChange={e => setPassword(e.target.value)}/>
     </label>

      <button onClick={loginDineWise}>
         Login
      </button>
    </div>
    </>
  );
}

export default Login;
