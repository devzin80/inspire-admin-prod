'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const TopBar = () => {
    const [user, setUser] = useState({})
    useEffect(() => {
        const userDetails = localStorage.getItem('user')
            ? JSON.parse(localStorage.getItem('user'))
            : null

            setUser(userDetails)
    }, [])
    return (
        <div className='w-full'>
            <div className='flex justify-end items-center px-9 py-6 gap-4'>
                <div className='mr-4'>
                    <Image
                        src={'/topnotification-icon.svg'}
                        alt='Notification Icon'
                        width={40}
                        height={40}
                        priority
                    />
                </div>
                <div>
                    <p className='font-semibold font-neutral-600'>{`${user.firstName}  ${user.lastName}`}</p>
                    <p className='text-sm font-neutral-50 '>{user.role} </p>
                </div>
                <div>
                    <Image
                        src={'/avater.svg'}
                        alt='Profile Icon'
                        width={40}
                        height={40}
                        priority
                        className='rounded-full'
                    />
                </div>
            </div>
        </div>
    )
}

export default TopBar
