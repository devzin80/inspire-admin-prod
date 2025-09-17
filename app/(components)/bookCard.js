import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useGetSubCategoriesQuery } from '@/redux/services/subCagegory'
import { useGetClassesQuery } from '@/redux/services/class'
import { useRouter } from 'next/navigation'
import {
    useCreateBookMutation,
    useUpdateBookMutation,
} from '@/redux/services/book'
import { toast } from 'react-toastify'
import CustomImageUploader from './imageUploader'
import { useDispatch, useSelector } from 'react-redux'
import { clearImages, setMode } from '@/redux/slices/imageSlice'

const BookCard = ({ data, update }) => {
    const router = useRouter()
    const { images } = useSelector((state) => state.image)
    const dispatch = useDispatch()
    

    const [formData, setFormData] = useState({})
    const [deletedImages, setDeletedImages] = useState([])
    useEffect(() => {
        if (data) {
            setFormData(data)
        }
    }, [data])

    const { data: subCatData } = useGetSubCategoriesQuery()
    const { data: classData } = useGetClassesQuery()
    const [createBook] = useCreateBookMutation()
    const [updateBook] = useUpdateBookMutation()

    const handleReset = (e) => {
        e.preventDefault()
        setFormData({})
        router.back()
    }




    const handleUpdate = async () => {
        try {
            let uploadedUrls = []

            // ✅ Upload new images if any
            if (images.length > 0) {
                const formDataImg = new FormData()
                images.forEach((img) => {
                    formDataImg.append('images', img.file)
                })

                const uploadRes = await fetch(
                    `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/image-upload`,
                    { method: 'POST', body: formDataImg },
                )

                if (!uploadRes.ok) {
                    toast.error('Image upload failed')
                    return
                }

                const uploadData = await uploadRes.json()
                uploadedUrls = uploadData.urls || []
            }
            const newImages = uploadedUrls.filter(
                (url) => !deletedImages.includes(url),
            )


            // ✅ Merge uploaded URLs with existing book images
            const payload = {
                ...formData,
                images: newImages,
                deletedImages,
            }

            // Call your update API (assuming you have a mutation for update)
            const res = await updateBook({
                ...payload, // You may need a different mutation or API call for update
                id: formData._id, // send book ID if needed
            })

            if (res?.data?.success) {
                toast.success('Book updated successfully')
                setFormData({})
                dispatch(clearImages())
                router.push('/books')
            } else {
                toast.error(
                    res?.data?.message ||
                        'Failed to update book. Please try again.',
                )
            }
        } catch (e) {
            toast.error(e.message || 'Failed to update book. Please try again.')
        }
    }

    const handleSubmit = async () => {
        // console.log('I am formData of book', formData)

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

            // 2️⃣ merge uploaded URLs into formData
            const payload = {
                ...formData,
                images: uploadedUrls, // or image: uploadedUrls[0] if only single
            }

            const res = await createBook(payload)
            if (res?.data?.success) {
                toast.success('Book created successfully')
                setFormData({})
                dispatch(clearImages())
                router.push('/books')
            } else {
                toast.error(
                    res?.data?.message ||
                        'Failed to create book. Please try again.',
                )
            }
        } catch (e) {
            toast.error(e.message || 'Failed to create book. Please try again.')
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    return (
        <div>
            <div className='w-[50vw] p-5 my-6 bg-white rounded-lg flex flex-col  justify-center items-start gap-4  '>
                <div className='flex gap-5 justify-center  items-center w-full'>
                    <div className='w-full '>
                        <label
                            htmlFor='select-subCategory'
                            className='font-semibold '
                        >
                            Select Sub-Category
                        </label>
                        <Select
                            value={formData.subcategory || ''}
                            onValueChange={(value) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    subcategory: value,
                                }))
                            }
                        >
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Select Sub-Category' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {subCatData?.subCategories?.map(
                                        (subCat) => (
                                            <SelectItem
                                                key={subCat._id}
                                                value={subCat._id}
                                            >
                                                {subCat.title}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='w-full '>
                        <label
                            htmlFor='select-subCategory'
                            className='font-semibold '
                        >
                            Select Class
                        </label>
                        <Select
                            value={formData.class || ''}
                            onValueChange={(value) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    class: value,
                                }))
                            }
                        >
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Select Class' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {classData?.classes?.map((cls) => (
                                        <SelectItem
                                            key={cls._id}
                                            value={cls._id}
                                        >
                                            {cls.title}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className='my-5'>
                    <h1 className='font-semibold text-2xl my-2'>
                        Upload Book Cover
                    </h1>

                    <CustomImageUploader setDeletedImages={setDeletedImages} deletedImages={deletedImages} />
                </div>
                <div className='w-full'>
                    <label
                        htmlFor='Subject Name'
                        className='font-semibold '
                    >
                        Book Name
                    </label>
                    <input
                        name='title'
                        onChange={handleChange}
                        value={formData.title || ''}
                        type='text'
                        placeholder='Enter Book Name'
                        className='w-full p-2 border rounded mb-4'
                    />
                </div>
                <div className='w-full'>
                    <label
                        htmlFor='Subject Name'
                        className='font-semibold '
                    >
                        Slug
                    </label>
                    <input
                        name='slug'
                        onChange={handleChange}
                        value={formData.slug || ''}
                        type='text'
                        placeholder='Enter Book slug'
                        className='w-full p-2 border rounded mb-4'
                    />
                </div>
                <div className='w-full'>
                    <label
                        htmlFor='Writer Name'
                        className='font-semibold '
                    >
                        Writer
                    </label>
                    <input
                        name='writer'
                        onChange={handleChange}
                        value={formData.writer || ''}
                        type='text'
                        placeholder='Enter Writer Name'
                        className='w-full p-2 border rounded mb-4'
                    />
                </div>
                <div className='w-full'>
                    <label
                        htmlFor='Publication Name'
                        className='font-semibold '
                    >
                        Publication
                    </label>
                    <input
                        name='publication'
                        onChange={handleChange}
                        value={formData.publication || ''}
                        type='text'
                        placeholder='Enter Book Name'
                        className='w-full p-2 border rounded mb-4'
                    />
                </div>
                <div className='w-full'>
                    <label
                        htmlFor='Edition'
                        className='font-semibold '
                    >
                        Edition
                    </label>
                    <input
                        name='edition'
                        onChange={handleChange}
                        value={formData.edition || ''}
                        type='text'
                        placeholder='Enter Edition Number'
                        className='w-full p-2 border rounded mb-4'
                    />
                </div>
                <div className='w-full'>
                    <label
                        htmlFor=''
                        className='font-semibold '
                    >
                        Language
                    </label>
                    <input
                        name='language'
                        onChange={handleChange}
                        value={formData.language || ''}
                        type='text'
                        placeholder='Enter Book Language'
                        className='w-full p-2 border rounded mb-4'
                    />
                </div>
                <div className='w-full'>
                    <label
                        htmlFor=''
                        className='font-semibold '
                    >
                        Type
                    </label>
                    <input
                        name='type'
                        onChange={handleChange}
                        value={formData.type || ''}
                        type='text'
                        placeholder='Enter Book Type'
                        className='w-full p-2 border rounded mb-4'
                    />
                </div>
                <div className='w-full'>
                    <label
                        htmlFor=''
                        className='font-semibold '
                    >
                        Price
                    </label>
                    <input
                        name='price'
                        onChange={handleChange}
                        value={formData.price || ''}
                        type='text'
                        placeholder='Enter Price'
                        className='w-full p-2 border rounded mb-4'
                    />
                </div>
                <div className='w-full'>
                    <label
                        htmlFor=''
                        className='font-semibold '
                    >
                        Offer Price
                    </label>
                    <input
                        name='offerPrice'
                        onChange={handleChange}
                        value={formData.offerPrice || ''}
                        type='text'
                        placeholder='Enter Offer Price'
                        className='w-full p-2 border rounded mb-4'
                    />
                </div>
                <div className='w-full'>
                    <label
                        htmlFor=''
                        className='font-semibold '
                    >
                        Stock
                    </label>
                    <input
                        name='stock'
                        onChange={handleChange}
                        value={formData.stock || ''}
                        type='text'
                        placeholder='Enter Book stock'
                        className='w-full p-2 border rounded mb-4'
                    />
                </div>
                <div className='w-full gap-4 flex justify-end items-center mb-10'>
                    <button
                        className='px-5 py-3 bg-gray-200 rounded-md text-neutral-800 text-sm font-medium leading-5 cursor-pointer'
                        onClick={handleReset}
                    >
                        Cancel
                    </button>
                    <button
                        className='px-5 py-3 bg-sky-600 rounded-md text-white text-sm font-medium leading-5 cursor-pointer'
                        onClick={() =>
                            update ? handleUpdate() : handleSubmit()
                        }
                    >
                        {update ? 'Update' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BookCard
