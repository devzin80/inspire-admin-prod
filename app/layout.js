import { Inter } from 'next/font/google'
import './globals.css'
import { cookies } from 'next/headers'
import MainPanel from './(components)/mainPanel'
import MainLoginPanel from './(components)/mainLogin'
import { ToastContainer } from 'react-toastify'
import { Providers } from './provider'

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
})

export default async function RootLayout({ children }) {
    const cookieStore = await cookies()
    const user = cookieStore.get('user')?.value // null if not logged in

    return (
        <html lang='en'>
            <body className={`${inter.className} antialiased`}>
                <Providers>
                    {user ? (
                        <MainPanel>{children}</MainPanel>
                    ) : (
                        <MainLoginPanel>{children}</MainLoginPanel>
                    )}
                </Providers>
                <ToastContainer />
            </body>
        </html>
    )
}
