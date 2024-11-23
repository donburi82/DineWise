import  React from 'react';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './Login.css';
import {loginSuccess, loginFail} from '../Mock/LoginData'

function Login() {
    const serverBaseURL = process.env.REACT_APP_SERVER_API_BASE_URL;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginErr, setLoginErr] = useState('');

    const navigate = useNavigate();

    async function loginDineWise() {
        if (email === '' || password === '') {
            setLoginErr('Please fill in your email and password');
            return;
        }
        const data = {email: email, password: password};
        const loginAPI = `${serverBaseURL}/auth/login`;
        try {
            const response = await fetch(loginAPI, {
                   method: "POST",
                   body: JSON.stringify(data),
                   headers: {"Content-Type": "application/json"}
             });
            const result = await response.json();
            if (result.status === 'success') {
                navigate('/home', {state: result.token});
            } else {
                setLoginErr(result.msg);
            }
        } catch (error) {
            setLoginErr(error.message);
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
      <div>
      <button onClick={loginDineWise}>
         Login
      </button>
       </div>
      {loginErr !== "" ? <p className = 'err'>{loginErr}</p> : null}
    </div>
    </>
  );
}

export default Login;
