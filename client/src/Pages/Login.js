import  React from 'react';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './Login.css';
import {loginSuccess, loginFail} from '../Mock/LoginData'

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginErr, setLoginErr] = useState('');

    const navigate = useNavigate();
    function loginDineWise() {
        if (email !== '' && password !== '') {
            const data = {email: email, password: password};
            //try login
            const response = loginFail(data);
            // if succeed
            if (response.status) {
                navigate('/home', {state: response.token});
            } else {
                setLoginErr(response.msg);
            }
        } else {
            setLoginErr('Please fill in your email and password');
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

      {loginErr !== "" ? <p className = 'err'>{loginErr}</p> : null}
    </div>
    </>
  );
}

export default Login;
