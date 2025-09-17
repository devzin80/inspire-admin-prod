'use client'
import ImageUploader from '@/app/(components)/imageUploader'
import SubjectImageUploader from '@/app/(components)/subjectImageUploader'
import RichTextEditor from '@/app/(components)/TextEditor'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog'
import {
    useCreateAboutMutation,
    useGetAboutQuery,
    useUpdateAboutMutation,
} from '@/redux/services/about'
import {
    useCreateBannerMutation,
    useDeleteBannerMutation,
    useGetBannersQuery,
    useUpdateBannerMutation,
} from '@/redux/services/banner'
import {
    useCreateFooterMutation,
    useGetFootersQuery,
    useUpdateFooterMutation,
} from '@/redux/services/footer'
import {
    useCreateLogoMutation,
    useGetLogoQuery,
    useUpdateLogoMutation,
} from '@/redux/services/logo'
import {
    useCreateMediaMutation,
    useDeleteMediaMutation,
    useGetMediasQuery,
    useUpdateMediaMutation,
} from '@/redux/services/media'
import {
    useCreatePromotionalBannerMutation,
    useDeletePromotionalBannerMutation,
    useGetPromotionalBannersQuery,
    useUpdatePromotionalBannerMutation,
} from '@/redux/services/promotionalBanner'
import { addImage, clearImages } from '@/redux/slices/imageSlice'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

export default function CMS() {
    const { images } = useSelector((state) => state.image)
    const [logo, setLogo] = useState('')
    const [about, setAbout] = useState('')
    const [formData, setFormData] = useState({})
    const [createLogo] = useCreateLogoMutation()
    const [createFooter] = useCreateFooterMutation()
    const [updateFooter] = useUpdateFooterMutation()
    const { data: footerData } = useGetFootersQuery()
    const { data } = useGetLogoQuery()
    const [updateLogo] = useUpdateLogoMutation()
    const [createAbout] = useCreateAboutMutation()
    const [updateAbout] = useUpdateAboutMutation()
    const { data: aboutData } = useGetAboutQuery()
    const [createMedia] = useCreateMediaMutation()
    const [updateMedia] = useUpdateMediaMutation()
    const [deleteMedia] = useDeleteMediaMutation()
    const { data: mediaData } = useGetMediasQuery()
    const { data: bannerData } = useGetBannersQuery()
    const [createBanner] = useCreateBannerMutation()
    const [updateBanner] = useUpdateBannerMutation()
    const [deleteBanner] = useDeleteBannerMutation()
    const { data: promotionalBannerData } = useGetPromotionalBannersQuery()
    const [createPromotionalBanner] = useCreatePromotionalBannerMutation()
    const [updatePromotionalBanner] = useUpdatePromotionalBannerMutation()
    const [deletePromotionalBanner] = useDeletePromotionalBannerMutation()
    const imageLink = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${logo}`
    useEffect(() => {
        const mainLogo = data?.logo

        setLogo(mainLogo)
    }, [data])
    useEffect(() => {
        const content = aboutData?.aboutUs[0]?.about
        setAbout(content)
    }, [aboutData])
    // console.log(data)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }
    const handleUpdate = async () => {
        try {
            // ✅ If it's a File, upload it first

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

            const payload = {
                id: data?.logo[0]?._id,
                url: uploadedUrls[0], // the new logo URL
            }

            const logo = updateLogo(payload).unwrap()

            if (!logo) {
                toast.error('Submission failed')
                return
            }

            setLogo(uploadedUrls[0])
            clearImages()

            toast.success('Logo set successfully')
        } catch (err) {
            toast.error('Something went wrong')
        }
    }
    const handleSubmit = async () => {
        try {
            // ✅ If it's a File, upload it first

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

            const logo = createLogo({ url: uploadedUrls[0] }).unwrap()

            if (!logo) {
                toast.error('Submission failed')
                return
            }

            setLogo(uploadedUrls[0])
            clearImages()

            toast.success('Logo set successfully')
        } catch (err) {
            toast.error('Something went wrong')
        }
    }

    const handleFooterSubmit = async () => {
        console.log(formData)

        try {
            const footer = createFooter({ ...formData }).unwrap()
            if (!footer) {
                toast.error('Something went wrong')
                return
            }

            toast.success('Footer Created Successfully')
            setFormData({})
        } catch (e) {
            toast.error(e.message)
        }
    }
    const handleFooterUpdate = async () => {
        const payload = {
            id: footerData?.footer[0]._id,
            ...formData,
        }
        try {
            const footer = updateFooter(payload).unwrap()
            if (!footer) {
                toast.error('Something went wrong')
                return
            }

            toast.success('Footer Created Successfully')
            setFormData({})
        } catch (e) {
            toast.error(e.message)
        }
    }

    const handleAbout = async () => {
        try {
            const aboutUS = await createAbout({ about })
            if (!aboutUS) return toast.error('Error Creating About us content')

            toast.success('Successfully uploaded About us content')
            setAbout('')
        } catch (e) {
            toast.error(e.message)
        }
    }
    const handleAboutUpdate = async () => {
        const payload = {
            id: aboutData?.aboutUs[0]?._id,
            about,
        }
        try {
            const aboutUS = await updateAbout(payload)
            if (!aboutUS) return toast.error('Error Creating About us content')

            toast.success('Successfully uploaded About us content')
            setAbout('')
        } catch (e) {
            toast.error(e.message)
        }
    }

    const handleBannerSubmit = async () => {
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

            const media = await createBanner({
                ...formData,
                image: uploadedUrls[0],
            }).unwrap()

            if (media) {
                toast.success('Banner Added successfully')
                setFormData({})
            } else {
                toast.error('Failed to Add Banner with the provided data')
            }
        } catch (e) {
            toast.error(e.message || 'Something went wrong during Fetch')
        }
    }
    const handleBannerUpdate = async (id) => {
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

            const media = await updateBanner({
                id,
                ...formData,
                image: uploadedUrls[0],
            }).unwrap()

            if (media) {
                toast.success('Banner Updated successfully')
                setFormData({})
            } else {
                toast.error('Failed to Update Banner with the provided data')
            }
        } catch (e) {
            toast.error(e.message || 'Something went wrong during Fetch')
        }
    }
    const handleDeleteBanner = async (id) => {
        try {
            const media = await deleteBanner(id).unwrap()

            if (media) {
                toast.success('Banner Deleted successfully')
            } else {
                toast.error('Failed to delete Banner with the provided data')
            }
        } catch (e) {
            toast.error(e.message || 'Something went wrong during Fetch')
        }
    }
    const handlePromotionalBannerSubmit = async () => {
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

            const media = await createPromotionalBanner({
                ...formData,
                image: uploadedUrls[0],
            }).unwrap()

            if (media) {
                toast.success('PromotionalBanner Added successfully')
                setFormData({})
            } else {
                toast.error(
                    'Failed to Add PromotionalBanner with the provided data',
                )
            }
        } catch (e) {
            toast.error(e.message || 'Something went wrong during Fetch')
        }
    }
    const handlePromotionalBannerUpdate = async (id) => {
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

            const media = await updatePromotionalBanner({
                id,
                ...formData,
                image: uploadedUrls[0],
            }).unwrap()

            if (media) {
                toast.success('PromotionalBannerUpdated successfully')
                setFormData({})
            } else {
                toast.error(
                    'Failed to Update PromotionalBanner with the provided data',
                )
            }
        } catch (e) {
            toast.error(e.message || 'Something went wrong during Fetch')
        }
    }
    const handleDeletePromotionalBanner = async (id) => {
        try {
            const media = await deletePromotionalBanner(id).unwrap()

            if (media) {
                toast.success('PromotionalBanner Deleted successfully')
            } else {
                toast.error(
                    'Failed to delete PromotionalBanner with the provided data',
                )
            }
        } catch (e) {
            toast.error(e.message || 'Something went wrong during Fetch')
        }
    }
    const handleSocialSubmit = async () => {
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

            const media = await createMedia({
                ...formData,
                image: uploadedUrls[0],
            }).unwrap()

            if (media) {
                toast.success('Social Media Added successfully')
                setFormData({})
            } else {
                toast.error('Failed to Add Media with the provided data')
            }
        } catch (e) {
            toast.error(e.message || 'Something went wrong during Fetch')
        }
    }
    const handleMediaUpdate = async (id) => {
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

            const media = await updateMedia({
                id,
                ...formData,
                image: uploadedUrls[0],
            }).unwrap()

            if (media) {
                toast.success('Social Media Updated successfully')
                setFormData({})
            } else {
                toast.error('Failed to Update Media with the provided data')
            }
        } catch (e) {
            toast.error(e.message || 'Something went wrong during Fetch')
        }
    }
    const handleDeleteMedia = async (id) => {
        try {
            const media = await deleteMedia(id).unwrap()

            if (media) {
                toast.success('Social Media Deleted successfully')
            } else {
                toast.error('Failed to delete Media with the provided data')
            }
        } catch (e) {
            toast.error(e.message || 'Something went wrong during Fetch')
        }
    }

    return (
        <div>
            <h1 className='font-semibold text-2xl text-neutral-800'>
                Content Management System
            </h1>
            <div className='flex justify-between items-center gap-5 mt-5 mb-10'>
                <div className='rounded-2xl p-6 w-1/2 border bg-white h-[270px]'>
                    <div className='bg-white rounded-xl p-3'>
                        <div className='flex justify-between items-center'>
                            <p className='text-2xl font-bold text-neutral-800'>
                                Logo
                            </p>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button className='bg-sky-600 text-base font-medium leading-tight px-5 py-3 text-white rounded cursor-pointer'>
                                        {`${
                                            data?.success ? 'Update' : 'Add'
                                        } Logo`}
                                    </button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle className='text-2xl mb-2'>
                                            {`${
                                                data?.success ? 'Update' : 'Add'
                                            } Logo`}
                                        </DialogTitle>
                                    </DialogHeader>
                                    <SubjectImageUploader />
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <button
                                                className='px-5 py-3 bg-sky-600 rounded-md text-white text-sm font-medium leading-5 cursor-pointer'
                                                onClick={
                                                    data?.success
                                                        ? handleUpdate
                                                        : handleSubmit
                                                }
                                            >
                                                {data?.success
                                                    ? 'Update'
                                                    : 'Save'}
                                            </button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                    <div className='rounded-2xl p-6 w-1/2'>
                        <Image
                            src={imageLink}
                            alt='Logo'
                            width={250}
                            height={250}
                            className='object-contain w-full h-full'
                        />
                    </div>
                </div>
                <div className='rounded-2xl p-6 w-1/2 border bg-white'>
                    <div className='bg-white rounded-xl p-3'>
                        <div className='flex justify-between items-center'>
                            <p className='text-2xl font-bold text-neutral-800'>
                                Footer
                            </p>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button className='bg-sky-600 text-base font-medium leading-tight px-5 py-3 text-white rounded cursor-pointer'>
                                        {`${
                                            footerData?.footer
                                                ? 'Update'
                                                : 'Add'
                                        } Address`}
                                    </button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle className='text-2xl mb-2'>
                                            {`${
                                                footerData?.footer
                                                    ? 'Update'
                                                    : 'Add'
                                            } Address`}
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className='my-5'>
                                        <label htmlFor=''>Address</label>
                                        <input
                                            name='address'
                                            onChange={handleChange}
                                            value={formData.address || ''}
                                            type='text'
                                            placeholder='Enter Address'
                                            className='w-full p-2 border rounded mb-4'
                                        />
                                        <div className='flex justify-between gap-5'>
                                            <div className='w-1/2'>
                                                <label htmlFor=''>
                                                    Phone Number
                                                </label>
                                                <input
                                                    name='phone'
                                                    onChange={handleChange}
                                                    value={formData.phone || ''}
                                                    type='text'
                                                    placeholder='Enter Phone Number'
                                                    className='w-full p-2 border rounded mb-4'
                                                />
                                            </div>
                                            <div className='w-1/2'>
                                                <label htmlFor=''>Email</label>
                                                <input
                                                    name='email'
                                                    onChange={handleChange}
                                                    value={formData.email || ''}
                                                    type='email'
                                                    placeholder='Enter Email'
                                                    className='w-full p-2 border rounded mb-4'
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <button
                                                className='px-5 py-3 bg-sky-600 rounded-md text-white text-sm font-medium leading-5 cursor-pointer'
                                                onClick={
                                                    footerData?.footer
                                                        ? handleFooterUpdate
                                                        : handleFooterSubmit
                                                    // handleFooterSubmit
                                                }
                                            >
                                                {footerData?.footer
                                                    ? 'Update'
                                                    : 'Save'}
                                            </button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                    <div className='border rounded-2xl p-5 my-2'>
                        <p className=' font-semibold leading-loose text-neutral-800'>
                            Address: {footerData?.footer[0]?.address}
                        </p>
                        <p className=' font-semibold leading-loose text-neutral-800'>
                            PhoneNumber: {footerData?.footer[0]?.phone}
                        </p>
                        <p className=' font-semibold leading-loose text-neutral-800'>
                            Email Address: {footerData?.footer[0]?.email}
                        </p>
                    </div>
                </div>
            </div>

            {/* 2nd row */}

            <div className='flex justify-between items-center gap-5 mt-5'>
                <div className='rounded-2xl p-3 bg-white w-1/2'>
                    <div className='flex justify-between items-center my-4'>
                        <p className='text-xl font-semibold leading-loose text-neutral-800'>
                            About Us{' '}
                        </p>
                        <button
                            className='bg-sky-600 text-base font-medium leading-tight px-5 py-3 text-white rounded cursor-pointer'
                            onClick={
                                aboutData?.aboutUs[0]?.about
                                    ? handleAboutUpdate
                                    : handleAbout
                            }
                        >
                            {aboutData?.aboutUs[0]?.about ? 'Update' : 'Save'}
                        </button>
                    </div>
                    <RichTextEditor
                        value={about}
                        onChange={setAbout}
                    />
                </div>
                <div className='rounded-2xl p-3 bg-white w-1/2 h-[600px]'>
                    <div className='flex justify-between items-center my-4'>
                        <p className='text-xl font-semibold leading-loose text-neutral-800'>
                            Social Accounts{' '}
                        </p>

                        <Dialog>
                            <DialogTrigger asChild>
                                {/* Edit Trigger Here */}
                                <button className='bg-sky-600 text-base font-medium leading-tight px-5 py-3 text-white rounded cursor-pointer'>
                                    Add
                                </button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className='text-2xl mb-2'>
                                        Add Social Media
                                    </DialogTitle>
                                </DialogHeader>

                                <div className='flex gap-5'>
                                    <div className='w-1/2'>
                                        {' '}
                                        <label
                                            htmlFor='Class'
                                            className=''
                                        >
                                            Social Media Name
                                        </label>
                                        <input
                                            name='name'
                                            onChange={handleChange}
                                            value={formData.name || ''}
                                            type='text'
                                            placeholder='Enter Social Media Name'
                                            className='w-full p-2 border rounded mb-4 text-sm'
                                        />
                                    </div>
                                </div>

                                <h1 className='font-semibold text-xl my-1'>
                                    Social Media Image
                                </h1>

                                <SubjectImageUploader />

                                <label
                                    htmlFor='Price'
                                    className=''
                                >
                                    Url
                                </label>
                                <input
                                    name='url'
                                    onChange={handleChange}
                                    value={formData.url || ''}
                                    type='text'
                                    placeholder='Enter Social Media url'
                                    className='w-full p-2 border rounded mb-4'
                                />
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <button
                                            className='px-5 py-3 bg-sky-600 rounded-md text-white text-sm font-medium leading-5 cursor-pointer'
                                            onClick={handleSocialSubmit}
                                        >
                                            save
                                        </button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Media Map here */}
                    <div className='rounded border p-5 bg-gray-200  overflow-hidden '>
                        <div className='overflow-y-auto h-[400px]'>
                            {mediaData?.medias?.map((media, index) => (
                                <div
                                    className='rounded-md p-2 bg-white border my-3'
                                    key={index}
                                >
                                    <div className='flex justify-between items-center'>
                                        <p className='font-semibold'>
                                            {media.name}
                                        </p>
                                        <div className=' h-[52px] justify-center items-center gap-2 flex'>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    {/* Edit Trigger Here */}
                                                    <div
                                                        onClick={() => {
                                                            setFormData({
                                                                name: media.name,
                                                                url: media.url,
                                                            })
                                                            addImage(
                                                                media.image,
                                                            )
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
                                                            Update Social Media
                                                        </DialogTitle>
                                                    </DialogHeader>

                                                    <div className='flex gap-5'>
                                                        <div className='w-1/2'>
                                                            {' '}
                                                            <label
                                                                htmlFor='Class'
                                                                className=''
                                                            >
                                                                Social Media
                                                                Name
                                                            </label>
                                                            <input
                                                                name='name'
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                value={
                                                                    formData.name ||
                                                                    ''
                                                                }
                                                                type='text'
                                                                placeholder='Enter Social Media Name'
                                                                className='w-full p-2 border rounded mb-4 text-sm'
                                                            />
                                                        </div>
                                                    </div>

                                                    <h1 className='font-semibold text-xl my-1'>
                                                        Social Media Image
                                                    </h1>

                                                    <SubjectImageUploader />

                                                    <label
                                                        htmlFor='Price'
                                                        className=''
                                                    >
                                                        Url
                                                    </label>
                                                    <input
                                                        name='url'
                                                        onChange={handleChange}
                                                        value={
                                                            formData.url || ''
                                                        }
                                                        type='text'
                                                        placeholder='Enter Social Media url'
                                                        className='w-full p-2 border rounded mb-4'
                                                    />
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <button
                                                                className='px-5 py-3 bg-sky-600 rounded-md text-white text-sm font-medium leading-5 cursor-pointer'
                                                                onClick={() => {
                                                                    handleMediaUpdate(
                                                                        media._id,
                                                                    )
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
                                                            Delete this Social
                                                            Media?
                                                        </DialogTitle>

                                                        <p className='text-neutral-800'>
                                                            Are you sure you
                                                            want to delete this
                                                            Social Media? This
                                                            action cannot be
                                                            undone.
                                                        </p>
                                                    </DialogHeader>
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <button
                                                                className='px-5 py-3 bg-red-600 rounded-md text-white text-sm font-medium leading-5 cursor-pointer'
                                                                onClick={
                                                                    () => {
                                                                        handleDeleteMedia(
                                                                            media._id,
                                                                        )
                                                                    }
                                                                    // deleteMedia
                                                                }
                                                            >
                                                                Delete
                                                            </button>
                                                        </DialogClose>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </div>
                                    <div className='flex gap-5 h-[60px] items-center my-5'>
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/${media.image}`}
                                            alt='edit'
                                            width={20}
                                            height={20}
                                            className='w-1/3 h-full object-contain'
                                        />
                                        <p className='p-3 border rounded border-gray-300 w-2/3'>
                                            {media.url}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3rd row */}
            <div className='flex justify-between items-center gap-5 my-5'>
                <div className='rounded-2xl p-3 bg-white w-1/2 h-[600px]'>
                    <div className='flex justify-between items-center my-4'>
                        <p className='text-xl font-semibold leading-loose text-neutral-800'>
                            Banner{' '}
                        </p>

                        <Dialog>
                            <DialogTrigger asChild>
                                {/* Edit Trigger Here */}
                                <button className='bg-sky-600 text-base font-medium leading-tight px-5 py-3 text-white rounded cursor-pointer'>
                                    Add
                                </button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className='text-2xl mb-2'>
                                        Add Banner
                                    </DialogTitle>
                                </DialogHeader>

                                <h1 className='font-semibold text-xl my-1'>
                                    Banner Image
                                </h1>

                                <SubjectImageUploader />

                                <label
                                    htmlFor='Price'
                                    className=''
                                >
                                    Banner Link
                                </label>
                                <input
                                    name='url'
                                    onChange={handleChange}
                                    value={formData.url || ''}
                                    type='text'
                                    placeholder='Enter Social Media url'
                                    className='w-full p-2 border rounded mb-4'
                                />
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <button
                                            className='px-5 py-3 bg-sky-600 rounded-md text-white text-sm font-medium leading-5 cursor-pointer'
                                            onClick={handleBannerSubmit}
                                        >
                                            save
                                        </button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Media Map here */}
                    <div className='rounded border p-5 bg-gray-200  overflow-hidden '>
                        <div className='overflow-y-auto h-[400px]'>
                            {bannerData?.banners?.map((banner, index) => (
                                <div
                                    className='rounded-md p-2 bg-white border my-3'
                                    key={index}
                                >
                                    <div className='flex justify-end items-center'>
                                        <div className=' h-[52px] justify-center items-center gap-2 flex'>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    {/* Edit Trigger Here */}
                                                    <div
                                                        onClick={() => {
                                                            setFormData({
                                                                url: banner.url,
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
                                                            Update Banner
                                                        </DialogTitle>
                                                    </DialogHeader>

                                                    <h1 className='font-semibold text-xl my-1'>
                                                        Banner Image
                                                    </h1>

                                                    <SubjectImageUploader />

                                                    <label
                                                        htmlFor='Price'
                                                        className=''
                                                    >
                                                        Banner Link
                                                    </label>
                                                    <input
                                                        name='url'
                                                        onChange={handleChange}
                                                        value={
                                                            formData.url || ''
                                                        }
                                                        type='text'
                                                        placeholder='Enter Social Media url'
                                                        className='w-full p-2 border rounded mb-4'
                                                    />
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <button
                                                                className='px-5 py-3 bg-sky-600 rounded-md text-white text-sm font-medium leading-5 cursor-pointer'
                                                                onClick={() => {
                                                                    handleBannerUpdate(
                                                                        banner._id,
                                                                    )
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
                                                            Delete this Social
                                                            Media?
                                                        </DialogTitle>

                                                        <p className='text-neutral-800'>
                                                            Are you sure you
                                                            want to delete this
                                                            Social Media? This
                                                            action cannot be
                                                            undone.
                                                        </p>
                                                    </DialogHeader>
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <button
                                                                className='px-5 py-3 bg-red-600 rounded-md text-white text-sm font-medium leading-5 cursor-pointer'
                                                                onClick={
                                                                    () => {
                                                                        handleDeleteBanner(
                                                                            banner._id,
                                                                        )
                                                                    }
                                                                    // deleteMedia
                                                                }
                                                            >
                                                                Delete
                                                            </button>
                                                        </DialogClose>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </div>
                                    <div className='flex gap-5 h-[60px] items-center my-5'>
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/${banner.image}`}
                                            alt='edit'
                                            width={20}
                                            height={20}
                                            className='w-1/3 h-full object-contain'
                                        />
                                        <p className='p-3 border rounded border-gray-300 w-2/3'>
                                            {banner.url}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='rounded-2xl p-3 bg-white w-1/2 h-[600px]'>
                    <div className='flex justify-between items-center my-4'>
                        <p className='text-xl font-semibold leading-loose text-neutral-800'>
                            Promotional Banner{' '}
                        </p>

                        <Dialog>
                            <DialogTrigger asChild>
                                {/* Edit Trigger Here */}
                                <button className='bg-sky-600 text-base font-medium leading-tight px-5 py-3 text-white rounded cursor-pointer'>
                                    Add
                                </button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className='text-2xl mb-2'>
                                        Add Promotional Banner
                                    </DialogTitle>
                                </DialogHeader>

                                <h1 className='font-semibold text-xl my-1'>
                                    Promotional Banner Image
                                </h1>

                                <SubjectImageUploader />

                                <label
                                    htmlFor='Price'
                                    className=''
                                >
                                    Banner Link
                                </label>
                                <input
                                    name='url'
                                    onChange={handleChange}
                                    value={formData.url || ''}
                                    type='text'
                                    placeholder='Enter Social Media url'
                                    className='w-full p-2 border rounded mb-4'
                                />
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <button
                                            className='px-5 py-3 bg-sky-600 rounded-md text-white text-sm font-medium leading-5 cursor-pointer'
                                            onClick={handlePromotionalBannerSubmit}
                                        >
                                            save
                                        </button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Media Map here */}
                    <div className='rounded border p-5 bg-gray-200  overflow-hidden '>
                        <div className='overflow-y-auto h-[400px]'>
                            {promotionalBannerData?.promotionalBanners?.map(
                                (banner, index) => (
                                    <div
                                        className='rounded-md p-2 bg-white border my-3'
                                        key={index}
                                    >
                                        <div className='flex justify-end items-center'>
                                            <div className=' h-[52px] justify-center items-center gap-2 flex'>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        {/* Edit Trigger Here */}
                                                        <div
                                                            onClick={() => {
                                                                setFormData({
                                                                    url: banner.url,
                                                                })
                                                            }}
                                                            className='cursor-pointer p-2 bg-sky-200 rounded-[99px] justify-center items-center flex'
                                                        >
                                                            <Image
                                                                src={
                                                                    '/edit.svg'
                                                                }
                                                                alt='edit'
                                                                width={16}
                                                                height={16}
                                                            />
                                                        </div>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle className='text-2xl mb-2'>
                                                                Update Banner
                                                            </DialogTitle>
                                                        </DialogHeader>

                                                        <h1 className='font-semibold text-xl my-1'>
                                                            Banner Image
                                                        </h1>

                                                        <SubjectImageUploader />

                                                        <label
                                                            htmlFor='Price'
                                                            className=''
                                                        >
                                                            Banner Link
                                                        </label>
                                                        <input
                                                            name='url'
                                                            onChange={
                                                                handleChange
                                                            }
                                                            value={
                                                                formData.url ||
                                                                ''
                                                            }
                                                            type='text'
                                                            placeholder='Enter Social Media url'
                                                            className='w-full p-2 border rounded mb-4'
                                                        />
                                                        <DialogFooter>
                                                            <DialogClose
                                                                asChild
                                                            >
                                                                <button
                                                                    className='px-5 py-3 bg-sky-600 rounded-md text-white text-sm font-medium leading-5 cursor-pointer'
                                                                    onClick={() => {
                                                                        handlePromotionalBannerUpdate(
                                                                            banner._id,
                                                                        )
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
                                                                src={
                                                                    '/delete.svg'
                                                                }
                                                                alt='edit'
                                                                width={16}
                                                                height={16}
                                                            />
                                                        </div>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle className='text-2xl mb-2 '>
                                                                Delete this
                                                                Social Media?
                                                            </DialogTitle>

                                                            <p className='text-neutral-800'>
                                                                Are you sure you
                                                                want to delete
                                                                this Social
                                                                Media? This
                                                                action cannot be
                                                                undone.
                                                            </p>
                                                        </DialogHeader>
                                                        <DialogFooter>
                                                            <DialogClose
                                                                asChild
                                                            >
                                                                <button
                                                                    className='px-5 py-3 bg-red-600 rounded-md text-white text-sm font-medium leading-5 cursor-pointer'
                                                                    onClick={
                                                                        () => {
                                                                            handleDeletePromotionalBanner(
                                                                                banner._id,
                                                                            )
                                                                        }
                                                                        // deleteMedia
                                                                    }
                                                                >
                                                                    Delete
                                                                </button>
                                                            </DialogClose>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </div>
                                        <div className='flex gap-5 h-[60px] items-center my-5'>
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/${banner.image}`}
                                                alt='edit'
                                                width={20}
                                                height={20}
                                                className='w-1/3 h-full object-contain'
                                            />
                                            <p className='p-3 border rounded border-gray-300 w-2/3'>
                                                {banner.url}
                                            </p>
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* env div */}
        </div>
    )
}
