'use client'
import BackBtn from '@/app/(components)/BackBtn'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'react-toastify'

import { useGetSubjectByIdQuery } from '@/redux/services/subject'
import React, { useState } from 'react'
import {
    useCreateChapterMutation,
    useDeleteChapterMutation,
    useGetChaptersQuery,
    useUpdateChapterMutation,
} from '@/redux/services/chapter'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Subject({ params }) {
    const { subID } = React.use(params)
    const { data: subjectData } = useGetSubjectByIdQuery(subID)
    const [createChapter] = useCreateChapterMutation()
    // const { data: chapterData } = useGetChaptersQuery()
    const [deleteChapter] = useDeleteChapterMutation()
    const [updateChapter] = useUpdateChapterMutation()
    // const { subject } = subjectData
    const router = useRouter()
    const [formData, setFormData] = useState({})

    const handleUpdate = async () => {
        try {
            const update = await updateChapter({ ...formData }).unwrap()
            if (!update) {
                toast.error('Chapter not updated')
                return
            }
            toast.success('Chapter Updated Successfully')
            setFormData({})
            window.location.reload()
        } catch (e) {
            toast.error(e.message)
        }
    }

    const handleDelete = async (id) => {
        try {
            const deleted = await deleteChapter(id)
            if (!deleted) {
                toast.error('Failed to delete Chapter')
                return
            }
            toast.success('successfully Deleted Chapter')
            setFormData({})
            window.location.reload()
        } catch (e) {
            toast.error(e.message)
        }
    }
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async () => {
        const chapter = {
            ...formData,
            subject: subID,
        }
        try {
            const chapterCreated = await createChapter(chapter).unwrap()

            if (!chapterCreated) toast.error('Something went wrong')
            toast.success('Chapter Created Successfully')
            setFormData({})
            window.location.reload()
        } catch (e) {
            toast.error(e.message)
        }
    }

    return (
        <div className='bg-[#F7F9FC] py-9 px-5 rounded-2xl'>
            <BackBtn />
            <p className='text-2xl font-semibold leading-loose text-neutral-900'>
                {subjectData?.subject?.title}
            </p>
            <p className='text-base font-medium leading-tight text-neutral-600'>
                Price: ৳{' '}
                {Number(subjectData?.subject?.price).toLocaleString('bn-IN')}
            </p>

            <div className='my-8 p-3 bg-[#F3F4F6] rounded-xl '>
                <div className='flex justify-between items-center'>
                    <p className='text-xl font-semibold leading-loose text-neutral-900'>
                        Chapters
                    </p>
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className='bg-sky-600 text-base font-medium leading-tight px-5 py-3 text-white rounded cursor-pointer'>
                                Add Chapter
                            </button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className='text-2xl mb-2'>
                                    Add Chapter
                                </DialogTitle>
                            </DialogHeader>

                            <div className=''>
                                {' '}
                                <label
                                    htmlFor='Class'
                                    className=''
                                >
                                    Chapter Name
                                </label>
                                <input
                                    name='title'
                                    onChange={handleChange}
                                    value={formData.title || ''}
                                    type='text'
                                    placeholder='Enter Chapter Name'
                                    className='w-full p-2 border rounded mb-4'
                                />
                            </div>
                            <div className=''>
                                {' '}
                                <label
                                    htmlFor='Class'
                                    className=''
                                >
                                    Chapter Slug
                                </label>
                                <input
                                    name='slug'
                                    onChange={handleChange}
                                    value={formData.slug || ''}
                                    type='text'
                                    placeholder='Enter Chapter slug'
                                    className='w-full p-2 border rounded mb-4 text-sm'
                                />
                            </div>

                            <label
                                htmlFor='Price'
                                className=''
                            >
                                Set Price
                            </label>
                            <input
                                name='price'
                                onChange={handleChange}
                                value={formData.price || ''}
                                type='text'
                                placeholder='Enter Chapter Price'
                                className='w-full p-2 border rounded mb-4'
                            />
                            <DialogFooter>
                                <DialogClose asChild>
                                    <button
                                        className='px-5 py-3 bg-sky-600 rounded-md text-white text-sm font-medium leading-5 cursor-pointer'
                                        onClick={handleSubmit}
                                    >
                                        Save
                                    </button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                {/* Chapter Loop */}

                <div className='bg-white p-4 mt-9'>
                    {subjectData?.subject?.chapters?.map((c, index) => (
                        <div
                            className='border rounded-xl flex justify-between px-4 py-3 my-3'
                            key={index}
                        >
                            <div
                                className='text-base text-neutral-800 leading-loose font-semibold flex gap-5 items-center cursor-pointer'
                                onClick={() => {
                                    router.push(
                                        `/course-upload/subject/${subID}/chapter/${c._id}`,
                                    )
                                }}
                            >
                                <p> {c.title} </p>
                                <p className='text-red-500'>
                                    {Number(c.price).toLocaleString('bn-IN')}
                                </p>
                            </div>
                            <div className=' h-[52px] justify-center items-center gap-2 flex'>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <div
                                            onClick={() => {
                                                setFormData({
                                                    id: c._id,
                                                    title: c.title,
                                                    slug: c.slug,
                                                    price: c.price,
                                                })
                                            }}
                                            className='cursor-pointer p-2 bg-sky-200 rounded-[99px] justify-center items-center flex'
                                        >
                                            <Image
                                                src={'/edit.svg'}
                                                alt='edit'
                                                width={16}
                                                height={16}
                                            />
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle className='text-2xl mb-2'>
                                                Edit Chapter
                                            </DialogTitle>
                                        </DialogHeader>

                                        <div className=''>
                                            {' '}
                                            <label
                                                htmlFor='Class'
                                                className=''
                                            >
                                                Chapter Name
                                            </label>
                                            <input
                                                name='title'
                                                onChange={handleChange}
                                                value={formData.title || ''}
                                                type='text'
                                                placeholder='Enter Chapter Name'
                                                className='w-full p-2 border rounded mb-4'
                                            />
                                        </div>
                                        <div className=''>
                                            {' '}
                                            <label
                                                htmlFor='Class'
                                                className=''
                                            >
                                                Chapter Slug
                                            </label>
                                            <input
                                                name='slug'
                                                onChange={handleChange}
                                                value={formData.slug || ''}
                                                type='text'
                                                placeholder='Enter Chapter slug'
                                                className='w-full p-2 border rounded mb-4 text-sm'
                                            />
                                        </div>

                                        <label
                                            htmlFor='Price'
                                            className=''
                                        >
                                            Set Price
                                        </label>
                                        <input
                                            name='price'
                                            onChange={handleChange}
                                            value={formData.price || ''}
                                            type='text'
                                            placeholder='Enter Chapter Price'
                                            className='w-full p-2 border rounded mb-4'
                                        />
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <button
                                                    className='px-5 py-3 bg-sky-600 rounded-md text-white text-sm font-medium leading-5 cursor-pointer'
                                                    onClick={() => {
                                                        handleUpdate(c._id)
                                                    }}
                                                >
                                                    Update
                                                </button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

                                {/* Trigger the Modal to edit category */}

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <div className='cursor-pointer p-2 bg-red-200 rounded-[99px] justify-center items-center flex'>
                                            <Image
                                                src={'/delete.svg'}
                                                alt='edit'
                                                width={16}
                                                height={16}
                                            />
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle className='text-2xl mb-2 '>
                                                Delete this Chapter?
                                            </DialogTitle>

                                            <p className='text-neutral-800'>
                                                Are you sure you want to delete
                                                this book? This action cannot be
                                                undone.
                                            </p>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <button
                                                    className='px-5 py-3 bg-red-600 rounded-md text-white text-sm font-medium leading-5 cursor-pointer'
                                                    onClick={() => {
                                                        handleDelete(c._id)
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ModelTest */}

            <div className='my-8 p-3 bg-red-50 rounded-xl '>
                <div className='flex justify-between items-center'>
                    <p className='text-xl font-semibold leading-loose text-neutral-900'>
                        Model Tests
                    </p>
                    <button
                        className='bg-sky-600 text-base font-medium leading-tight px-5 py-3 text-white rounded cursor-pointer'
                        onClick={() => {
                            router.push(`${subID}/modeltest`)
                        }}
                    >
                        Create Test
                    </button>
                </div>
                {/* Test Loop */}
                <div className='bg-white p-4 mt-9'>
                    {subjectData?.subject?.modelTests?.map((test, index) => (
                        <div
                            className='border rounded-xl flex justify-between px-4 py-3 my-3'
                            key={index}
                        >
                            <div
                                className='text-base text-neutral-800 leading-loose font-semibold flex gap-5 items-center'
                                // onClick={() => {
                                //     // router.push(`/chapter/${c._id}`)
                                // }}
                            >
                                <p className='font-bold'> {test.title} </p>
                                <p className='text-gray-500'>
                                    {test.questions.length} MCQ
                                </p>
                                <p className='text-gray-500'>
                                    {test.totalTimeLimit} Min
                                </p>
                            </div>
                            <div className=' h-[52px] justify-center items-center gap-2 flex'>
                                <div
                                    // onClick={() => {}}
                                    className='cursor-pointer p-2 bg-sky-200 rounded-[99px] justify-center items-center flex'
                                >
                                    <Image
                                        src={'/edit.svg'}
                                        alt='edit'
                                        width={16}
                                        height={16}
                                    />
                                </div>

                                {/* Trigger the Modal to edit category */}

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <div className='cursor-pointer p-2 bg-red-200 rounded-[99px] justify-center items-center flex'>
                                            <Image
                                                src={'/delete.svg'}
                                                alt='edit'
                                                width={16}
                                                height={16}
                                            />
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle className='text-2xl mb-2 '>
                                                Delete this Book?
                                            </DialogTitle>

                                            <p className='text-neutral-800'>
                                                Are you sure you want to delete
                                                this book? This action cannot be
                                                undone.
                                            </p>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <button
                                                    className='px-5 py-3 bg-red-600 rounded-md text-white text-sm font-medium leading-5 cursor-pointer'
                                                    // onClick={() =>
                                                    //     handleDelete()
                                                    // }
                                                >
                                                    Delete
                                                </button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
