'use client'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const Login = () => {
    const router = useRouter()
    const [formData, setFormData] = useState({})
    const [step, setStep] = useState('login') // signup, login, forgotPassword, resetPassword,otp

    useEffect(() => {
        const adminUserExists = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_API_URL}/users/find-admin-user`,
                )
                const data = await response.json()

                if (data.user) {
                    setStep('login')
                } else {
                    setStep('signup')
                }
            } catch (error) {
                console.error('Error checking admin user:', error)
            }
        }
        adminUserExists()
    }, [])

        const handleChange = (e) => {
            const { name, value } = e.target
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }))
        }

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_API_URL}/users/admin-login`,
                formData,
                { withCredentials: true }, // allow cookies to be set from API
            )

            if (res.status === 200 && res.data.user) {
                toast.success('Login successful!')
                localStorage.setItem('user', JSON.stringify(res.data.user)) // Store user in localStorage
                router.push('/dashboard') // redirect after login
            } else {
                toast.error('Invalid email or password')
            }
        } catch (e) {
            console.error('Login error:', e)
            toast.error('Login failed. Please try again.')
        } finally {
            setFormData({})
            router.refresh() // Refresh the page to reflect login state
        }
        // Reset form after submission, if needed
    }

    const handleSignUp = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_API_URL}/users/create-admin-user`,
                {
                    ...formData,
                    role: 'superAdmin',
                    isVerified: true,
                },
            )

            if (res.status == 200 && res.data.user) {
                toast.success('Admin user created successfully!')

                setFormData({}) // Reset form after successful signup
                setStep('login') // Redirect to login after successful signup
            }
        } catch (e) {
            toast.error('Error creating admin user. Please try again.')
        }
    }

    return (
        <div className='flex justify-center items-center h-full w-full'>
            <div className='w-1/3 bg-white rounded-3xl px-9 py-8'>
                <div className='mb-2'>
                    <div className='w-full h-full'>
                        <Image
                            src='/inspire-logo.svg'
                            alt='Login Icon'
                            width={150}
                            height={50}
                            priority
                            className='object-contain mx-auto'
                        />
                    </div>
                </div>
                <div>
                    <div>
                        <h1 className='text-center font-semibold text-neutral-900 text-2xl leading-loose mb-10'>
                            {step == 'signup'
                                ? 'Hi, Sign Up to Continue'
                                : 'Welcome Back !'}
                        </h1>
                    </div>

                    {/* Signup Form */}

                    {step == 'signup' && (
                        <>
                            <form
                                className='flex flex-col gap-3'
                                onSubmit={handleSignUp}
                            >
                                <label className='text-gray-700 font-medium'>
                                    First Name
                                </label>
                                <input
                                    name='firstName'
                                    onChange={handleChange}
                                    value={formData.firstName || ''}
                                    type='text'
                                    placeholder='Enter your First Name'
                                    className='text-neutral-800 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                />
                                <label className='text-gray-700 font-medium'>
                                    Last Name
                                </label>
                                <input
                                    name='lastName'
                                    onChange={handleChange}
                                    value={formData.lastName || ''}
                                    type='text'
                                    placeholder='Enter your Last Name'
                                    className='text-neutral-800 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                />

                                <label className='text-gray-700 font-medium'>
                                    Email
                                </label>
                                <input
                                    name='email'
                                    onChange={handleChange}
                                    value={formData.email || ''}
                                    type='email'
                                    placeholder='Enter your email'
                                    className='text-neutral-800 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                />
                                <label className='text-gray-700 font-medium'>
                                    Phone Number
                                </label>
                                <input
                                    name='phoneNumber'
                                    onChange={handleChange}
                                    value={formData.phoneNumber || ''}
                                    type='text'
                                    placeholder='Enter your Phone Number'
                                    className='text-neutral-800 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                />
                                <label className='text-gray-700 font-medium'>
                                    Password
                                </label>
                                <input
                                    name='password'
                                    onChange={handleChange}
                                    type='password'
                                    value={formData.password || ''}
                                    placeholder='Enter your password'
                                    className='text-neutral-800 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                />

                                <button
                                    type='submit'
                                    className='mt-2 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition duration-200 cursor-pointer'
                                >
                                    Sign Up
                                </button>
                            </form>
                        </>
                    )}

                    {/* Login Form */}

                    {step == 'login' && (
                        <form
                            className='flex flex-col gap-3'
                            onSubmit={handleLogin}
                        >
                            <label className='text-gray-700 font-medium'>
                                Email
                            </label>
                            <input
                                name='email'
                                onChange={handleChange}
                                value={formData.email || ''}
                                type='email'
                                placeholder='Enter your email'
                                className='text-neutral-800 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                            <label className='text-gray-700 font-medium'>
                                Password
                            </label>
                            <input
                                name='password'
                                onChange={handleChange}
                                type='password'
                                value={formData.password || ''}
                                placeholder='Enter your password'
                                className='text-neutral-800 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                            <p
                                className='cursor-pointer text-sm text-blue-600 font-semibold'
                                onClick={() => setStep('forgotPassword')}
                            >
                                Forget Password ?
                            </p>
                            <button
                                type='submit'
                                className='mt-1 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition duration-200 cursor-pointer'
                            >
                                Sign In
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Login
