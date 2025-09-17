    'use client'

    import Image from 'next/image'
    import Link from 'next/link'
    import React from 'react'

    const SideNav = () => {
        const navData = [
            {
                name: 'Dashboard',
                icon: '/dashboard-icon.svg',
                link: '/dashboard',
            },
            {
                name: 'Analytics',
                icon: '/analytics-icon.svg',
                link: '/analytics',
            },
            {
                name: 'Course Setup',
                icon: '/dashboard-icon.svg',
                link: '/course-setup',
            },
            {
                name: 'Course Upload',
                icon: '/course-icon.svg',
                link: '/course-upload',
            },
            {
                name: 'Books',
                icon: '/books-icon.svg',
                link: '/books',
            },
            {
                name: 'Order Status',
                icon: '/order-icon.svg',
                link: '/order-status',
            },
            {
                name: 'Students',
                icon: '/students-icon.svg',
                link: '/students',
            },
            {
                name: 'QnA',
                icon: '/qna-icon.svg',
                link: '/qna',
            },
            {
                name: 'Notification',
                icon: '/notification-icon.svg',
                link: '/notification',
            },
            {
                name: 'CMS',
                icon: '/cms-icon.svg',
                link: '/cms',
            },
            {
                name: 'Coupon',
                icon: '/coupon-icon.svg',
                link: '/coupon',
            },
        ]

        return (
            <div className='p-6 overflow-y-scroll '>
                {navData.map((nav, index) => {
                    return (
                        <Link
                            href={nav.link}
                            className='mb-1'
                            key={index}
                        >
                            <div className='flex gap-2 px-2.5 py-4 hover:bg-[#E0F2FE] rounded-lg'>
                                <Image
                                    src={nav.icon}
                                    alt={nav.name}
                                    width={20}
                                    height={20}
                                    priority
                                />
                                <p className='text-neutral-700 text-base font-semibold leading-tight'>
                                    {nav.name}
                                </p>
                            </div>
                        </Link>
                    )
                })}
            </div>
        )
    }

    export default SideNav
