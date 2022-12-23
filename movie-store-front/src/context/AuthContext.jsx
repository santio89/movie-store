import React from 'react'
import { useState, useEffect } from 'react';
import { createContext } from 'react'

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null)

  const logout = () => {
    fetch("/api/user/logout").then((res) => res.json()).then(res => {
      if (res.data.status === "ok") {
        setUser(null)
      }
    }).catch((e) => { console.log("error logging out: ", e) })
  }

  useEffect(() => {
    fetch("/api/user/logged").then(res => res.json()).then(res => {
      if (res?.data?.status === "ok" && !user) {
        setUser(res.data.user)
      }
    }).catch((e) => { console.log("error fetching user: ", e) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
