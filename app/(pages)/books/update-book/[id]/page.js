'use client';
import BookCard from "@/app/(components)/bookCard";
import { useGetBookByIdQuery } from "@/redux/services/book";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";


export default  function UpdateBook({ params }) {
    const router = useRouter()
    const { id } =  React.use(params);
    const {data:bookData, isLoading} =  useGetBookByIdQuery(id);
    return (
        <div className='w-full h-full p-6  flex-col justify-start items-start gap-2 inline-flex'>
            {/*  breadcrumb */}
            <div className='h-6 justify-start items-center gap-2 inline-flex'>
                <div
                    onClick={() => router.back()}
                    className='cursor-pointer'
                >
                    <Image
                        src={'/arrow-left.svg'}
                        alt='arrow-left'
                        width={24}
                        height={24}
                        priority
                    />
                </div>
                <div>
                    <span className="text-gray-400 text-base font-medium font-['Inter'] leading-normal">
                        Books /{' '}
                    </span>
                    <span className="text-gray-700 text-base font-medium font-['Inter'] leading-normal">
                        Add New Book
                    </span>
                </div>
            </div>

            {/* Book component here */}
            <div className='flex justify-center items-center w-full'>
                <BookCard data={bookData?.book} update={true} />
            </div>
        </div>
    )
}