import React, { useContext, useRef, useEffect, useState } from 'react'
import { ErrorContext } from '../context/ErrorContext'

export default function Main({ children }) {
    const { error } = useContext(ErrorContext)
    const [errorTimeout, setErrortimeout] = useState("")
    const errorRef = useRef()


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
