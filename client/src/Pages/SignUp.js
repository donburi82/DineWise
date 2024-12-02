import React from 'react';
import {useState} from 'react';
import './SignUp.css';
import {useNavigate} from 'react-router-dom';

function SignUp() {
  const serverBaseURL = process.env.REACT_APP_SERVER_API_BASE_URL;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [OPT, setOPT] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [OPTVerified, setOPTVerified]= useState(false);
  const [OPTErr, setOPTErr] = useState('');
  const [signUpErr, setSignUpErr] = useState('');

  const navigate = useNavigate();

  async function sendOPT() {
        if (email === '') {
            setOPTErr('Please enter your email');
            return;
        }
        const data = {email: email};
        const getVerificationCodeAPI = `${serverBaseURL}/auth/getVerificationCode`;
        try {
            const response = await fetch(getVerificationCodeAPI, {
                   method: 'POST',
                   body: JSON.stringify(data),
                   headers: {'Content-Type': 'application/json'}
            });
            const result = await response.json();
            if (result.status === 'success') {
                //add symbol for success
                setOPTErr('');
            } else {
                setOPTErr(result.msg);
            }
        } catch (error) {
            setOPTErr(error.message);
        }
  }

  async function verifyOPT() {
        if (OPT === '') {
            setOPTErr('Please enter verification code');
            return;
        }
        const data = {email: email, verificationCode:OPT};
        const verifyAPI = `${serverBaseURL}/auth/verify`;
        try {
            const response = await fetch(verifyAPI, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {'Content-Type': 'application/json'}
                    });
            const result = await response.json();
            if (result.status === 'success') {
               //verified
               setOPTVerified(true);
               setOPTErr('');
            } else {
               setOPTVerified(false);
               setOPTErr(result.msg);
            }
        } catch(error) {
            setOPTErr(error.message);
        }

  }

  async function signUp () {
      if (canSignUp) {
         const data = {name: name, email: email, password: password}
         const signupAPI = `${serverBaseURL}/auth/signup`;
         //post to /auth/signup
         try {
              const response = await fetch(signupAPI, {
                     method: 'POST',
                     body: JSON.stringify(data),
                     headers: {'Content-Type': 'application/json'}
                     });
              const result = await response.json();

             if (result.status === 'success') {
                navigate('/login', {data: {jwt: result.token}});
             } else {
                setSignUpErr(result.msg);
             }
         } catch (error) {
             setSignUpErr(error.message);
         }
      } else {
          if (name === '' || password === '' || password2 === '' || email === '') {
            setSignUpErr('Please fill in all fields');
          }
          else if (password !== password2) {
            setSignUpErr('Password and confirm password are not the same');
          }
          else if (!OPTVerified) {
            setSignUpErr('Email is not verified');
          }
      }
  }

  const canSignUp = name !== ""
                    && OPTVerified
                    && password !== ""
                    && password === password2;

  return (
    <>
    <div style={{display:"flex", flexDirection: "column", alignItems:"center", marginTop:'100px',margin:"20px"}}>
    <h1> Sign Up</h1>
    <div>
        <label> Name:
            <input className="textBox" value={name} onChange={e => setName(e.target.value)}/>
         </label>
    </div>
     <div>
         <label> Email:
              <input className="textBox" value={email} onChange={e => setEmail(e.target.value)}/>
         </label>
         <button onClick= {sendOPT}>
         Send OPT
         </button>
     </div>
     <div>
         <label> OPT:
                <input className="textBox" value={OPT} onChange={e => setOPT(e.target.value)}/>
         </label>
         <button onClick= {verifyOPT}>
              Verify OPT
         </button>
     </div>
      <label> Password:
      <input className="textBox" value={password} onChange={e => setPassword(e.target.value)}/>
      </label>
      <label> Confirm password:
      <input className="textBox" value={password2} onChange={e => setPassword2(e.target.value)}/>
      </label>
      <div>
           <button className="signUpButton" onClick={signUp}>
            SIGN UP
           </button>
       </div>
       {OPTErr !== '' ? <p className='err'>{OPTErr}</p> : null}
       {signUpErr !== '' ? <p className='err'>{signUpErr}</p> : null}
     </div>

    </>
  );
}

export default SignUp;
