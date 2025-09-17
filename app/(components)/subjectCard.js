import {
    useDeleteSubjectMutation,
    useGetSubjectByIdQuery,
    useUpdateSubjectMutation,
} from '@/redux/services/subject'
import Image from 'next/image'
import Link from 'next/link'
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useGetSubCategoriesQuery } from '@/redux/services/subCagegory'
import { useGetClassesQuery } from '@/redux/services/class'
import CustomImageUploader from './imageUploader'
import { addImage, clearImages, setMode } from '@/redux/slices/imageSlice'
import { useDispatch, useSelector } from 'react-redux'
import SubjectImageUploader from './subjectImageUploader'

const SubjectCard = ({ subject }) => {
    const {
        _id: id,
        image,
        price,
        title,
        subcategory,
        class: level,
        slug,
    } = subject
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({})
    const { data } = useGetSubCategoriesQuery()
    const { data: classData } = useGetClassesQuery()
    const [updateSubject] = useUpdateSubjectMutation()
    const [deleteSubject] = useDeleteSubjectMutation()
    const { images } = useSelector((state) => state.image)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const imageLink = `${process.env.NEXT_PUBLIC_FRONTEND_URL}${image}`

    const handleUpdate = async (e) => {
        e.preventDefault()
        // console.log('I am update formData', formData)

        try {
            let uploadedUrls = []

            if (images.length > 0) {
                const formDataImg = new FormData()
                images.forEach((img) => {
                    formDataImg.append('images', img.file) // img.file comes from Redux state
                })

                const uploadRes = await fetch(
                    `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/image-upload`,
                    {
                        method: 'POST',
                        body: formDataImg,
                    },
                )

                if (!uploadRes.ok) {
                    toast.error('Image upload failed')
                }

                const uploadData = await uploadRes.json()
                // Assume backend returns something like { urls: ["https://..."] }
                uploadedUrls = uploadData.urls || []
            }

            const res = await updateSubject({
                id,
                price: formData.price,
                title: formData.subject,
                slug: formData.slug,
                image: uploadedUrls[0],
                subcategory: formData.selectedCategory,
                class: formData.selectedClass,
            }).unwrap()

            if (res.success && res.subject) {
                toast.success('Subject Updated successfully')
                setFormData({})
                dispatch(clearImages())
                window.location.reload()
            } else {
                toast.error('Failed to update Subject with the provided data')
            }
        } catch (e) {
            toast.error(e.message || 'Something went wrong during Fetch')
        }
    }
    const handleDelete = async (e) => {
        e.preventDefault()
        try {
            const res = await deleteSubject(id).unwrap()
            if (res.success) {
                toast.success('Subject Deleted successfully')
                setFormData({})
                window.location.reload()
            } else {
                toast.error('Failed to delete Subject with the provided data')
            }
        } catch (e) {
            toast.error(e.message || 'Something went wrong during Fetch')
        }
    }

    return (
        <div className='w-[30%] my-5 rounded-xl shadow-2xl '>
            <Image
                src={
                    image == '/default-subject-icon.svg'
                        ? '/default-subject-icon.svg'
                        : imageLink
                } //imageLink || '/default-subject-icon.svg'
                alt='Subject Icon'
                width={350}
                height={200}
                priority
                className=' object-cover h-[200px] w-full rounded-t-xl'
            />
            <div className='px-4 pb-4 bg-gray-50 rounded-b-xl '>
                <div>
                    <h2 className='text-xl font-semibold leading-loose text-black '>
                        {title || 'Subject Name'}
                    </h2>
                    <p className='text-sm text-neutral-500 leading-tight mb-1'>
                        {level?.title ||
                            subcategory?.title ||
                            'SubCategory: Anything'}
                    </p>
                    <p className='text-sm text-red-500 font-semibold leading-tight'>
                        ৳ {price || '0000'}
                    </p>
                </div>
                <div className='flex justify-between items-center gap-4 my-2'>
                    <Link
                        href={`/course-upload/subject/${id}`}
                        className='w-3/4'
                    >
                        <div className='px-4 py-2 w-full border-2 rounded-md border-neutral-200 text-center text-neutral-700 font-semibold cursor-pointer '>
                            View Details
                        </div>
                    </Link>

                    <Popover>
                        <PopoverTrigger asChild>
                            <div className='px-4 py-2  border-2 rounded-md border-neutral-200  text-neutral-700 cursor-pointer  '>
                                <Image
                                    src={'/dot-actions.svg'}
                                    alt='dot icon'
                                    width={24}
                                    height={24}
                                    priority
                                    className='object-contain'
                                />
                            </div>
                        </PopoverTrigger>
                        <PopoverContent
                            className={'rounded w-[10vw] space-y-0.5'}
                        >
                            <Dialog>
                                <DialogTrigger asChild>
                                    {/* Edit Trigger Here */}
                                    <div
                                        className='flex  items-center gap-3 cursor-pointer'
                                        onClick={() => {
                                            const img = `${process.env.NEXT_PUBLIC_FRONTEND_URL}${image}`
                                            dispatch(
                                                addImage({
                                                    previewUrl: img, // URL for the <Image /> preview
                                                    file: null, // no File object for already uploaded images
                                                }),
                                            )

                                            setFormData({
                                                id,
                                                selectedCategory:
                                                    subcategory?._id,
                                                selectedClass: level?._id,
                                                title,
                                                price,
                                                slug,
                                            })
                                        }}
                                    >
                                        <Image
                                            src={'/box-edit-icon.svg'}
                                            alt='edit icon'
                                            width={24}
                                            height={24}
                                            priority
                                            className='object-contain'
                                        />
                                        <p className='text-base text-slate-600 font-semibold leading-tight '>
                                            Edit{' '}
                                        </p>
                                    </div>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle className='text-2xl mb-2'>
                                            Edit Subject
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className='flex gap-5'>
                                        <div className='w-1/2'>
                                            <label
                                                htmlFor='subCategory'
                                                className=''
                                            >
                                                Sub-Category
                                            </label>
                                            <Select
                                                value={
                                                    formData.selectedCategory ||
                                                    ''
                                                }
                                                onValueChange={(value) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        selectedCategory: value,
                                                    }))
                                                }
                                            >
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue placeholder='Select a SubCategory' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {data?.subCategories?.map(
                                                            (cat) => {
                                                                return (
                                                                    <SelectItem
                                                                        value={
                                                                            cat._id
                                                                        }
                                                                        key={
                                                                            cat._id
                                                                        }
                                                                    >
                                                                        {
                                                                            cat.title
                                                                        }
                                                                    </SelectItem>
                                                                )
                                                            },
                                                        )}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className='w-1/2'>
                                            <label
                                                htmlFor='Class'
                                                className=''
                                            >
                                                Class
                                            </label>
                                            <Select
                                                value={
                                                    formData.selectedClass || ''
                                                }
                                                onValueChange={(value) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        selectedClass: value,
                                                    }))
                                                }
                                            >
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue placeholder='Select a Class' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {classData?.classes?.map(
                                                            (cls) => {
                                                                return (
                                                                    <SelectItem
                                                                        value={
                                                                            cls._id
                                                                        }
                                                                        key={
                                                                            cls._id
                                                                        }
                                                                    >
                                                                        {
                                                                            cls.title
                                                                        }
                                                                    </SelectItem>
                                                                )
                                                            },
                                                        )}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className='flex gap-5'>
                                        <div className='w-1/2'>
                                            {' '}
                                            <label
                                                htmlFor='Class'
                                                className=''
                                            >
                                                Subject Name
                                            </label>
                                            <input
                                                name='title'
                                                onChange={handleChange}
                                                value={formData.title || ''}
                                                type='text'
                                                placeholder='Enter Subject Name'
                                                className='w-full p-2 border rounded mb-4'
                                            />
                                        </div>
                                        <div className='w-1/2'>
                                            {' '}
                                            <label
                                                htmlFor='Class'
                                                className=''
                                            >
                                                Subject Slug
                                            </label>
                                            <input
                                                name='slug'
                                                onChange={handleChange}
                                                value={formData.slug || ''}
                                                type='text'
                                                placeholder='Enter Subject slug'
                                                className='w-full p-2 border rounded mb-4 text-sm'
                                            />
                                        </div>
                                    </div>

                                    <h1 className='font-semibold text-xl my-1'>
                                        Subject Image
                                    </h1>

                                    <SubjectImageUploader />

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
                                        placeholder='Enter Subject Price'
                                        className='w-full p-2 border rounded mb-4'
                                    />
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <button
                                                className='px-5 py-3 bg-sky-600 rounded-md text-white text-sm font-medium leading-5 cursor-pointer'
                                                onClick={handleUpdate}
                                            >
                                                Update
                                            </button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <Dialog>
                                <DialogTrigger asChild>
                                    {/* Delete Trigger Here */}
                                    <div
                                        className='flex items-center gap-3 cursor-pointer mt-1'
                                        onClick={() => {
                                            setFormData({
                                                id,
                                                title,
                                            })
                                        }}
                                    >
                                        <Image
                                            src={'/box-delete-icon.svg'}
                                            alt='edit icon'
                                            width={24}
                                            height={24}
                                            priority
                                            className='object-contain'
                                        />
                                        <p className='text-red-500 text-base font-semibold leading-tight '>
                                            Delete{' '}
                                        </p>
                                    </div>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle className='text-2xl mb-2 text-red-500'>
                                            Confirm Deletion
                                        </DialogTitle>
                                        <p className='text-base text-neutral-600 font-semibold leading-tight '>
                                            {` Are you sure you want to delete 
                                             ${formData?.title} ? This action cannot be
                                            undone.`}
                                        </p>
                                    </DialogHeader>

                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <button
                                                className='px-5 py-3 bg-red-600 rounded-md text-white text-sm font-medium leading-5 cursor-pointer'
                                                onClick={handleDelete}
                                            >
                                                Delete
                                            </button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>
    )
}

export default SubjectCard
