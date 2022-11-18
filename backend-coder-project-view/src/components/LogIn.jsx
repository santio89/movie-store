import React, { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext';
import {Navigate, Link} from 'react-router-dom';
import '../styles/css/LogInRegister.css'


export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const [sentLoading, setSentLoading] = useState(false);


  const handleSubmit = (event) => {
    event.preventDefault();
    setSentLoading(true)
    fetch("/api/user/login", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    }).then(res => res.json()).then(res => {
      if (res.data.status === "ok") {
        setUser(res.data.user)
      } else{
        setLoginError(res.data.message);
        setTimeout(()=>{
          setLoginError(false)
        }, 4000)
      }

      setSentLoading(false)
    }).catch(e=>{console.log("error logging in: ",e)})
  }

  return (
    <>
      {user ? <Navigate to="/"/>:
      <div className='login'>
        <h2>LOG IN</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="• E-MAIL" required value={email} onChange={e => setEmail(e.target.value)} maxLength="320" pattern="[^@\s]+@[^@\s]+\.[^@\s]+"/>
          <input type="password" placeholder="• PASSWORD" required value={password} onChange={e => setPassword(e.target.value)} />
          <button disabled={sentLoading}>{sentLoading?<span className="loader"></span>:<>ENVIAR</>}</button>
          {loginError && <div className="login__error">{loginError.toUpperCase()}</div>}
        </form>
        <Link to="/register">Registrarse</Link>
      </div>
  }
    </>
  )
}
