import React from 'react';
import {useState} from 'react';
import './SignUp.css';
import {useNavigate} from 'react-router-dom';

function SignUp() {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [opt, setOPT] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [OPTVerified, setOPTVerified]= useState(false);
  const navigate = useNavigate();

  const sendOPT = () => {

  }

  const verifyOPT = () => {
      //post to backend

      //verified
      setOPTVerified(true);
  }

  const signUp = () => {
      if (canSignUp) {
         const data = {firstName: firstName, lastName: lastName,
            email: email, password: password}
         //submit data
         console.log(data);
         navigate('/login');

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
                <input className="textBox" value={opt} onChange={e => setOPT(e.target.value)}/>
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
     </div>

    </>
  );
}

export default SignUp;
