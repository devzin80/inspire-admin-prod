'use client'
import React, { useState } from 'react'
import SubCatCard from './subCatCard'
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
import { useCreateSubjectMutation } from '@/redux/services/subject'
import CustomImageUploader from './imageUploader'
import { useDispatch, useSelector } from 'react-redux'
import { clearImages } from '@/redux/slices/imageSlice'

const CourseCard = ({ title, subCat }) => {
    const [formData, setFormData] = useState({})
    const [deletedImages, setDeletedImages] = useState([])
    const { images } = useSelector((state) => state.image)
        const dispatch = useDispatch()

    const { data } = useGetSubCategoriesQuery()
    const { data: classData } = useGetClassesQuery()

    // Subject API hooks

    const [createSubject] = useCreateSubjectMutation()

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        // console.log("I am formData", formData);

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

            const res = await createSubject({
                price: formData.price,
                title: formData.title,
                subcategory: formData.selectedCategory,
                class: formData.selectedClass,
                slug: formData.slug,
                image: uploadedUrls[0]
            }).unwrap()

            if (res.success && res.subject) {
                toast.success('Subject created successfully')
                setFormData({})
                dispatch(clearImages())
                window.location.reload()
            } else {
                toast.error('Failed to create Subject with the provided data')
            }
        } catch (e) {
            toast.error(e.message || 'Something went wrong during Fetch')
        }
    }
    return (
        <div className='rounded mb-8'>
            <div className='flex justify-between items-center bg-slate-50 shadow-t p-6 rounded-t-xl'>
                <h1 className='text-2xl leading-loose font-semibold'>
                    {title}
                </h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <button className='bg-sky-600 text-base font-medium leading-tight px-5 py-3 text-white rounded cursor-pointer'>
                            Add Subject
                        </button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className='text-2xl mb-2'>
                                Add Subject
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
                                    value={formData.selectedCategory || ''}
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
                                            {data?.subCategories?.map((cat) => {
                                                return (
                                                    <SelectItem
                                                        value={cat._id}
                                                        key={cat._id}
                                                    >
                                                        {cat.title}
                                                    </SelectItem>
                                                )
                                            })}
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
                                    value={formData.selectedClass || ''}
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
                                            {classData?.classes?.map((cls) => {
                                                return (
                                                    <SelectItem
                                                        value={cls._id}
                                                        key={cls._id}
                                                    >
                                                        {cls.title}
                                                    </SelectItem>
                                                )
                                            })}
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

                        <CustomImageUploader
                            setDeletedImages={setDeletedImages}
                            deletedImages={deletedImages}
                        />

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
                                    onClick={handleSubmit}
                                >
                                    Save
                                </button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className='bg-white'>
                {subCat.map((sub) => {
                    return (
                        <SubCatCard
                            key={sub._id}
                            subject={sub}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default CourseCard
