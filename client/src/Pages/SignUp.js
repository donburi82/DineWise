import React from 'react';
import {useState} from 'react';
import './SignUp.css';
import {verificationCodeSuccess, verificationCodeFail,
    verifySuccess, verifyFail,
    signupSuccess, signupFail} from '../Mock/SignUpData';
import {useNavigate} from 'react-router-dom';

function SignUp() {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [OPT, setOPT] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [OPTVerified, setOPTVerified]= useState(false);
  const [OPTErr, setOPTErr] = useState('');
  const [signUpErr, setSignUpErr] = useState('');

  const navigate = useNavigate();

  const sendOPT = () => {
        if (email !== '') {
            //post to /auth/getVerificationCode
            const data = {email: email};
            const response = verificationCodeSuccess(data);
            if (!response.status) {
                setOPTErr(response.msg);
            } else {
                setOPTErr('');
            }
        }
  }

  const verifyOPT = () => {
      if (OPT !== '') {
       //post to /auth/verify
       const data = {email: email, verificationCode:OPT};
       const response = verifySuccess(data);
       if (response.status) {
           //verified
           setOPTVerified(true);
           setOPTErr('');
       } else {
           setOPTVerified(false);
           setOPTErr(response.msg);
       }
      }
  }

  const signUp = () => {
      if (canSignUp) {
         const data = {firstName: firstName, lastName: lastName,
            email: email, password: password}
         //post to /auth/signup
         const response = signupSuccess(data);

         if (response.status) {
            navigate('/login', {data: {jwt: response.token}});
         } else {
            setSignUpErr(response.msg);
         }
      } else {
          if (firstName === '' || password === '' || password2 === '' || email === '') {
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

  const canSignUp = firstName !== ""
                    && lastName !== ""
                    && OPTVerified
                    && password !== ""
                    && password === password2;

  return (
    <>
    <div style={{display:"flex", flexDirection: "column", alignItems:"left", margin:"20px"}}>
    <h1> Sign Up</h1>

    <div>
        <label> First name:
         <input className="textBox" value={firstName} onChange={e => setFirstName(e.target.value)}/>
        </label>
    </div>
        <label> Last name:
            <input className="textBox" value={lastName} onChange={e => setLastName(e.target.value)}/>
         </label>
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
           <button className={canSignUp === true ? "signUpButton" : "unClickable"} onClick={signUp}>
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
