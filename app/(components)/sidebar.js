import Image from 'next/image'
import React from 'react'
import SideNav from './sideNavs'

const SideBar = () => {
    return (
        <div className='w-1/4 h-full'>
            <div className='p-2 mt-3'>
                <Image
                    src={'/inspire-logo.svg'}
                    alt='Inspire logo'
                    width={150}
                    height={50}
                    priority
                    className='mx-auto object-contain'
                />
            </div>
            <div>
                <SideNav />
            </div>
        </div>
    )
}

export default SideBar
