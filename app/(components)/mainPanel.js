import React from 'react'
import SideBar from './sidebar'
import TopBar from './topbar'

const MainPanel = ({ children }) => {
    return (
        <div className='w-full flex h-screen overflow-hidden'>
            <SideBar/>
            <div className='w-full h-full'>
                <TopBar />
                <div className=' h-screen bg-gray-100 overflow-auto p-6'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default MainPanel
