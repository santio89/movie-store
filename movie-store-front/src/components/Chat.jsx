import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from "react-router-dom";
import '../styles/css/Chat.css'
import { io } from "socket.io-client";
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const back = process.env.NODE_ENV === "production" ? "https://movie-store-back.up.railway.app/" : "http://localhost:8080/"
const socket = io(back, {
     withCredentials: true,
     transports: ['websocket', 'polling'],
});


export default function Chat() {
    const [chatOpen, setChatOpen] = useState(false);
    const [mensajesArray, setMensajesArray] = useState([]);
    const [mensaje, setMensaje] = useState("")
    const chatRef = useRef()
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleChatSubmit = async (e) => {
        e.preventDefault();

        /* checkeo tener session activa */
        try {
            const logged = await fetch("/api/user/logged")
            const logStatus = await logged.json()

            if (logStatus.data.status === 401) {
                navigate("/login")
                return
            }
        } catch (e) {
            console.log("error fetching login: ", e)
        }

        /* quito espacios en blanco de los extremos y checkeo mensaje vacio */
        const mensTrim = mensaje.trim();
        if (mensTrim.length === 0){
            return;
        }

        /* objeto de mensaje */
        const mensajeEnvio = {
            author: user,
            text: mensTrim || ""
        }

        setMensaje("");
        socket.emit("client:mensaje", mensajeEnvio);
    }

    socket.on("server:mensaje", async mensajeEnvio => {
        setMensajesArray([...mensajesArray, mensajeEnvio])
    })

    socket.on("server:mensajes", async mensajeEnvio => {
        setMensajesArray(mensajeEnvio.mensajes)
    })

    useEffect(() => {
        user && socket.emit("client:logged",);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    useEffect(() => {
        if (chatOpen) {
            chatRef.current.style.scrollBehavior = "auto";
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatOpen])

    useEffect(() => {
        if (chatOpen) {
            chatRef.current.style.scrollBehavior = "smooth";
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mensajesArray])

    return (
        <div className="chatWidget">
            <button className="chatWidget__btn" onClick={() => setChatOpen(chatOpen => !chatOpen)}>CHAT</button>

            {chatOpen &&
                <div className="chatWidget__outter">
                    <div className="chatWidget__chatContainer" ref={chatRef}>
                        <div className="chatWidget__header">
                            <span>CHAT</span>
                            <button className="chatWidget__close" onClick={() => setChatOpen(false)}>X</button></div>
                        <div className="chatWidget__chat">
                            {mensajesArray.map((mensaje, i) => {
                                return <div key={i} className={mensaje.author.role === 'admin' ? 'chatWidget__chat__msg__adm' : 'chatWidget__chat__msg'} >
                                    <img alt="pic" src={mensaje.author.avatar} />
                                    <span className='chatWidget__chat__msg__name'>{mensaje.author.name} | </span>
                                    <span className='chatWidget__chat__msg__text'>{mensaje.text}</span>
                                </div>
                            })}
                        </div>
                    </div>

                    <div className="chatWidget__send">
                        <form onSubmit={handleChatSubmit}>
                            <input className='chatWidget__send__input' type={"text"} placeholder="Escriba un mensaje" value={mensaje} onChange={(e) => setMensaje(e.target.value)}></input><button className='chatWidget__send__arrow'>➤</button>
                        </form>
                    </div>
                </div>
            }
        </div>
    )
}
