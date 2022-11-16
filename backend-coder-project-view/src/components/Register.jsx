import React from 'react'
import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Navigate, Link } from 'react-router-dom'
import '../styles/css/LogInRegister.css'

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [registerError, setRegisterError] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const [sentLoading, setSentLoading] = useState(false)


  const handleSubmit = (event) => {
    event.preventDefault();
    setSentLoading(true);

    const formInfo = new FormData();
    formInfo.append("email", email)
    formInfo.append("password", password)
    formInfo.append("name", name)
    formInfo.append("age", age)
    formInfo.append("address", address)
    formInfo.append("phone", phone)
    formInfo.append("avatar", avatar)

    fetch("/api/user/register", {
      method: "POST",
      body: formInfo,
      credentials: 'include'
    }).then(res => res.json()).then(res => {
      if (res.data.status === "ok") {
        setUser(res.data.user)
      } else{
        setRegisterError(res.data.message);
        
        setTimeout(()=>{
          setRegisterError(false)
        }, 4000)
      }
      
      setSentLoading(false);
    }).catch(e => console.log("error: ", e))
  }


  return (
    <>
      {user ? <Navigate to="/" /> : <div className='register'>
        <h2>REGISTER</h2>
        <form onSubmit={handleSubmit} encType='multipart/form-data'>
          <input type="text" title="E-MAIL" placeholder="• E-MAIL" required value={email} onChange={e => setEmail(e.target.value)} maxLength="320" pattern="[^@\s]+@[^@\s]+\.[^@\s]+" />
          <input type="password" tite="PASSWORD" placeholder="• PASSWORD" required value={password} onChange={e => setPassword(e.target.value)} />
          <input type="text" title="NOMBRE" placeholder="• NOMBRE" required value={name} onChange={e => setName(e.target.value)} />
          <input type="text" title="EDAD" placeholder="• EDAD" required value={age} onChange={e => {
            if (!isNaN(e.target.value) && e.target.value < 200) {
              setAge(e.target.value)
            }
          }} />
          <input type="text" title="DIRECCION" placeholder="• DIRECCION" required value={address} onChange={e => setAddress(e.target.value)} />
          <input type="tel" title='TELEFONO ARG (EJ 1123456789)' placeholder="• TELEFONO ARG (EJ 1123456789): " required value={phone} onChange={e => {
            if (!isNaN(e.target.value)) {
              setPhone(e.target.value)
            }
          }
          } pattern="[0-9]+" />
          <label>• AVATAR: <input type="file" name="avatar" required onChange={e => setAvatar(e.target.files[0])} /></label>
          <button disabled={sentLoading}>{sentLoading?<span className="loader"></span>:<>ENVIAR</>}</button>
          {registerError && <div className="register__error">{registerError.toUpperCase()}</div>}
        </form>
        <Link to="/login">Ir al login</Link>
      </div>}
    </>
  )
}
