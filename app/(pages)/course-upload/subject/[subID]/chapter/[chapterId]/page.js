'use client'
import BackBtn from '@/app/(components)/BackBtn'
import { useGetChapterByIdQuery } from '@/redux/services/chapter'
import React, { useState } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
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
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
    useCreateTopicMutation,
    useDeleteTopicMutation,
    useGetTopicByIdQuery,
    useGetTopicsQuery,
} from '@/redux/services/topic'

const Chapter = ({ params }) => {
    const { chapterId, subID } = React.use(params)
    

    const { data: chapterData } = useGetChapterByIdQuery(chapterId)
    const [createTopic] = useCreateTopicMutation()
    const [deleteTopic] = useDeleteTopicMutation()
    const { data: TopicsData } = useGetTopicByIdQuery(chapterId)

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

    const handleTopicDelete = async (id) => {
        toast.error("I am triggered anyhow")
        try {
            const deleted = await deleteTopic(id)
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

    const handleTopicSubmit = async () => {
        toast.success('I am in create topic')
        const topic = {
            ...formData,
            chapter: chapterId,
        }
        try {
            const chapterTopic = await createTopic(topic).unwrap()

            if (!chapterTopic) {
                toast.error('Something went wrong')
                return
            }
            toast.success('Topic Created Successfully')
            setFormData({})
            window.location.reload()
        } catch (e) {
            toast.error(e.message)
        }
    }

    return (
        <div className='bg-[#F7F9FC] py-9 px-5 rounded-2xl'>
            <BackBtn />
            <div className='flex justify-between items-center'>
                <div>
                    <p className='text-2xl font-semibold leading-loose text-neutral-900'>
                        {chapterData?.chapter?.title}
                    </p>
                    <p className='text-base font-medium leading-tight text-neutral-600'>
                        Price: ৳{' '}
                        {Number(chapterData?.chapter?.price).toLocaleString(
                            'bn-IN',
                        )}
                    </p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <button className='bg-sky-600 text-base font-medium leading-tight px-5 py-3 text-white rounded cursor-pointer'>
                            Create Topic
                        </button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className='text-2xl mb-2'>
                                Create Topic
                            </DialogTitle>
                        </DialogHeader>

                        <div className=''>
                            {' '}
                            <label
                                htmlFor='Class'
                                className=''
                            >
                                Topic Name
                            </label>
                            <input
                                name='title'
                                onChange={handleChange}
                                value={formData.title || ''}
                                type='text'
                                placeholder='Enter Topic Name'
                                className='w-full p-2 border rounded mb-4'
                            />
                        </div>
                        <div className=''>
                            {' '}
                            <label
                                htmlFor='Class'
                                className=''
                            >
                                Topic Slug
                            </label>
                            <input
                                name='slug'
                                onChange={handleChange}
                                value={formData.slug || ''}
                                type='text'
                                placeholder='Enter Topic slug'
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
                            placeholder='Enter Topic Price'
                            className='w-full p-2 border rounded mb-4'
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <button
                                    className='px-5 py-3 bg-sky-600 rounded-md text-white text-sm font-medium leading-5 cursor-pointer'
                                    onClick={handleTopicSubmit}
                                >
                                    Save
                                </button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className='my-8 p-3 bg-red-50 rounded-xl '>
                <div className='flex justify-between items-center'>
                    <p className='text-xl font-semibold leading-loose text-neutral-900'>
                        Model Tests
                    </p>
                    <button className='bg-sky-600 text-base font-medium leading-tight px-5 py-3 text-white rounded cursor-pointer'>
                        Create Test
                    </button>
                </div>
                {/* Chapter Loop */}
                <div className='bg-white p-4 mt-9'>
                    <div
                        className='border rounded-xl flex justify-between px-4 py-3 my-3'
                        //key={index}
                    >
                        <div
                            className='text-base text-neutral-800 leading-loose font-semibold flex gap-5 items-center'
                            onClick={() => {
                                // router.push(`/chapter/${c._id}`)
                            }}
                        >
                            <p> {} </p>
                            <p className='text-red-500'>
                                {Number().toLocaleString('bn-IN')}
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
                                            Are you sure you want to delete this
                                            book? This action cannot be undone.
                                        </p>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <button
                                                className='px-5 py-3 bg-red-600 rounded-md text-white text-sm font-medium leading-5 cursor-pointer'
                                                // onClick={() => handleDelete()}
                                            >
                                                Delete
                                            </button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>

            {/* topics loop here */}

            {chapterData?.chapter?.topics?.map((topic, index) => (
                <div
                    className='my-8 p-3 bg-[#F3F4F6] rounded-xl '
                    key={index}
                >
                    <div className='flex justify-between items-center'>
                        <p className='text-xl font-semibold leading-loose text-neutral-900'>
                            {topic.title}
                        </p>
                        <Popover>
                            <PopoverTrigger>
                                <div className='bg-sky-600 text-base font-medium leading-tight px-5 py-3 text-white rounded cursor-pointer'>
                                    Add
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className={'w-[10vw]'}>
                                <div className='rounded cursor-pointer '>
                                    <p
                                        className='text-md w-full border-b-2 py-1'
                                        onClick={() => {
                                            router.push(
                                                `/course-upload/subject/${subID}/chapter/${chapterId}/topic/${topic._id}`,
                                            )
                                        }}
                                    >
                                        Upload Video
                                    </p>
                                    <p className='text-md w-full'>
                                        Create Quiz
                                    </p>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                    {/* Chapter Loop */}
                    <div className='bg-white p-4 mt-9' >
                    {topic?.videos?.map((v, index) => (
                        <div
                            className='border rounded-xl flex justify-between px-4 py-3 my-3'
                            key={index}
                        >
                            <div
                                className='text-base text-neutral-800 leading-loose font-semibold flex gap-5 items-center'
                                onClick={() => {
                                    // router.push(`/chapter/${c._id}`)
                                }}
                            >
                                <p> {v.title} </p>
                                <p className='text-neutral-600 font-sm'>
                                    {v.duration} min
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
                                                Delete this Topic?
                                            </DialogTitle>

                                            <p className='text-neutral-800'>
                                                Are you sure you want to delete
                                                this topic? This action cannot
                                                be undone.
                                            </p>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <button
                                                    className='px-5 py-3 bg-red-600 rounded-md text-white text-sm font-medium leading-5 cursor-pointer'
                                                    // onClick={() =>
                                                    //     handleTopicDelete(
                                                    //         topic._id)
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
            ))}
        </div>
    )
}

export default Chapter
