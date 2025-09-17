'use client'
import SubjectImageUploader from '@/app/(components)/subjectImageUploader'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useCreateVideoMutation } from '@/redux/services/video'
import { useCreateNoteMutation } from '@/redux/services/note'
import { useRouter } from 'next/navigation'
import { clearImages } from '@/redux/slices/imageSlice'
const Video = ({ params }) => {
    const dispatch = useDispatch()
    const router = useRouter()
    const { images } = useSelector((state) => state.image)
    const { id } = React.use(params)
    const [formData, setFormData] = useState({})
    const [createVideo] = useCreateVideoMutation()
    const [createNote] = useCreateNoteMutation()

    // const imageLink = `${process.env.NEXT_PUBLIC_FRONTEND_URL}${image}`

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }
    const handleResourceUpload = async (e) => {
        const file = e.target.files[0] // first selected file
        if (!file) return
        const fileName = file.name
        const formData = new FormData()
        formData.append('file', file)
        try {
            const res = await fetch('/api/file-uploader', {
                method: 'POST',
                body: formData,
            })

            const data = await res.json()
            if (data.url) {
                setFormData({
                    ...formData,
                    noteName: fileName,
                    noteUrl: data.url,
                })
                console.log('Uploaded File URL:', data.url)
            } else {
                console.error('Upload failed:', data.error)
            }
        } catch (err) {
            console.error('Error uploading file:', err)
        }
    }

    const handleTranscode = async () => {
        const res = await fetch('/api/transcode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileName: formData.path }), // must exist in /videos
        })
        const data = await res.json()
        console.log(data)

        if (data.success) {
            toast.success('Video Uploaded Successfully')
            setFormData({ ...formData, url: data.masterUrl })
        } else {
            toast.error(data.error)
            console.log(data.error)
        }
    }
    const handleSubmit = async () => {
        console.log(formData)

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

            const videoPayload = {
                title: formData.title,
                slug: formData.slug,
                url: formData.url,
                description: formData.description,
                preview: formData.preview,
                duration: formData.duration,
                thumbnail: uploadedUrls[0],
                topic: id,
            }

            const newVideo = await createVideo(videoPayload).unwrap()
            if (!newVideo) {
                toast.error('Something went wrong')
            }
            toast.success('Video Created Successfully')
            const notePayload = {
                title: formData.noteName,
                url: formData.noteUrl,
                video: newVideo._id,
            }

            const newNote = await createNote(notePayload).unwrap()

            if (!newNote) {
                toast.error('Something went wrong with note')
            }
            toast.success('Note Created Successfully')
            setFormData({})
            dispatch(clearImages())
            router.back()
        } catch (e) {
            toast.error(e.message)
        }
    }

    return (
        <div>
            <div className='flex justify-center items-center mb-40'>
                <div className='rounded-xl w-1/2 p-5 bg-white'>
                    <div className='my-3'>
                        <label>Video Type</label>

                        <RadioGroup
                            defaultValue={formData.preview || ''}
                            onValueChange={(value) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    preview: value,
                                }))
                            }
                            className={'flex ga-3'}
                        >
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem
                                    value={true}
                                    id='option-one'
                                />
                                <label htmlFor='option-one'>Preview</label>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem
                                    value={false}
                                    id='option-two'
                                />
                                <label htmlFor='option-two'>Premium</label>
                            </div>
                        </RadioGroup>
                    </div>
                    <label>Video Title</label>
                    <input
                        name='title'
                        onChange={handleChange}
                        value={formData.title || ''}
                        type='text'
                        placeholder='Enter Video Title'
                        className='w-full p-2 border rounded mb-4'
                    />
                    <label>Video Slug</label>
                    <input
                        name='slug'
                        onChange={handleChange}
                        value={formData.slug || ''}
                        type='text'
                        placeholder='Enter Video Slug'
                        className='w-full p-2 border rounded mb-4'
                    />
                    <label>Video Duration (mm:ss)</label>
                    <input
                        name='duration'
                        onChange={handleChange}
                        value={formData.duration || ''}
                        type='text'
                        placeholder='Enter Video Duration'
                        className='w-full p-2 border rounded mb-4'
                    />
                    <h1 className='text-base text-neutral-800 my-2'>
                        Upload Video Thumbnail
                    </h1>
                    <SubjectImageUploader />
                    <h1 className='text-base text-neutral-800 my-2'>
                        Transcode Video
                    </h1>
                    <div className='relative w-full mb-4'>
                        <input
                            name='path'
                            onChange={handleChange}
                            value={formData.path || ''}
                            type='text'
                            placeholder='Enter Video Path'
                            className='w-full p-2 pr-20 border rounded'
                        />
                        <button
                            onClick={handleTranscode}
                            disabled={formData.url}
                            className='absolute right-0 top-1/2 -translate-y-1/2 px-3 py-2 bg-sky-500 text-white rounded cursor-pointer'
                        >
                            Start
                        </button>
                        {formData.url && (
                            <span className='absolute right-0 top-1/2 -translate-y-1/2 px-3 py-2 bg-sky-500 text-white rounded cursor-pointer'>
                                Video Uploaded
                            </span>
                        )}
                    </div>

                    <div>
                        <h1 className='text-base text-neutral-800 my-2'>
                            Add Resource
                        </h1>
                        <input
                            name='resource'
                            type='file'
                            onChange={handleResourceUpload}
                            className='w-full p-2 pr-20 border rounded'
                        />
                    </div>
                    <label htmlFor=''>Description</label>
                    <textarea
                        name='description'
                        onChange={handleChange}
                        value={formData.description || ''}
                        type='text'
                        placeholder='Enter Description'
                        className='w-full p-2 pr-20 border rounded h-[20vh]'
                    />
                    <button
                        className='bg-sky-600 text-base font-medium leading-tight px-5 py-3 text-white rounded cursor-pointer mt-4'
                        onClick={handleSubmit}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Video
