import React from 'react'
import { useState } from 'react';
import { createContext } from 'react'

export const ErrorContext = createContext();

export default function ErrorContextProvider({children}) {
    const [error, setError] = useState(false)



    return (
        <ErrorContext.Provider value={{error, setError}}>
            {children}
        </ErrorContext.Provider>
    )
}
