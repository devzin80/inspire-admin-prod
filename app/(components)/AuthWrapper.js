// app/(components)/AuthWrapper.jsx
'use client'

import { useState, useEffect } from 'react'
import MainPanel from './mainPanel'
import MainLoginPanel from './mainLogin'

export default function AuthWrapper({ children }) {
    const [user, setUser] = useState(null)
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            setUser(storedUser)
        }
    }, [])

    // Render nothing on the server
    if (!isClient) {
        return null
    }

    return user ? (
        <MainPanel>{children}</MainPanel>
    ) : (
        <MainLoginPanel>{children}</MainLoginPanel>
    )
}
