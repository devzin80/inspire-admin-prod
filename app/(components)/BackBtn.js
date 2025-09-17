'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const BackBtn = () => {
    const router = useRouter()
  return (
    <div onClick={() => router.back()}>
        <Image
        src={'/arrow-left.svg'}
        alt='back key'
        width={24}
        height={24}
        priority
         />
    </div>
  )
}

export default BackBtn