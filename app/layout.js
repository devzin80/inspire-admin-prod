import { Inter } from 'next/font/google'
import './globals.css'
import { cookies } from 'next/headers'
import MainPanel from './(components)/mainPanel'
import MainLoginPanel from './(components)/mainLogin'
import { ToastContainer } from 'react-toastify'
import { Providers } from './provider'
import AuthWrapper from './(components)/AuthWrapper'

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
})

export default async function RootLayout({ children }) {
 // null if not logged in

    return (
        <html lang='en'>
            <body className={`${inter.className} antialiased`}>
                <Providers>
                    <AuthWrapper>
                        {children}
                    </AuthWrapper>
                </Providers>
                <ToastContainer />
            </body>
        </html>
    )
}
