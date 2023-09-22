import React, { useContext, useRef, useEffect, useState } from 'react'
import { ErrorContext } from '../context/ErrorContext'
import { io } from "socket.io-client";

const back = process.env.NODE_ENV === "production" ? "https://movie-store-back.onrender.com/" : "http://localhost:8080/"
const socket = io(back, {
     withCredentials: true,
     transports: ['websocket', 'polling'],
});

export default function Main({ children }) {
    const { error, setError } = useContext(ErrorContext)
    const [errorTimeout, setErrortimeout] = useState("")
    const errorRef = useRef()

    /* errores del back en requests los manejo con try/catch y se muestran por consola en front. para errores no manejados, los mando con socket y se muestran en front con un modal y el detalle */
    socket.on("server: uncaughtException", async error =>{
        setError(error.toString())
    })

    useEffect(() => {
        if (error) {
            clearTimeout(errorTimeout)
            errorRef.current.showModal()

            const timeoutId = setTimeout(() => {
                errorRef.current.close()
            }, 200000)

            setErrortimeout(timeoutId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error])

    return (
        <main className='main-content'>
            {children}

            <dialog ref={errorRef} className="errorModal">
                <h4>ERROR</h4>
                <p>Detalles: </p>
                <p>{error.toString()}</p>
                <button onClick={() => { errorRef.current.close() }}>Cerrar</button>
            </dialog>
        </main>
    )
}
