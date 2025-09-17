'use client'
import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'
import { addImage, removeImage } from '@/redux/slices/imageSlice'

export default function SubjectImageUploader() {
    const inputRef = useRef(null)
    const dispatch = useDispatch()
    const { mode, images } = useSelector((state) => state.image)

    const handleClick = () => {
        inputRef.current.click()
    }

    const handleChange = (e) => {
        const files = Array.from(e.target.files)

        files.forEach((file) => {
            const previewUrl = URL.createObjectURL(file)
            dispatch(addImage({ file, previewUrl }))
        })

        // reset input so selecting the same file again works
        e.target.value = ''
    }
    function sanitizeUrl(obj) {
        if (!obj?.previewUrl) return ''

        // Match everything from /uploads/ onward
        const match = obj.previewUrl.match(/\/uploads\/.+$/)
        return match ? match[0] : ''
    }

    const handleRemove = (index, img) => {
        const filtered = sanitizeUrl(img)
        // setDeletedImages([...deletedImages, filtered])
        dispatch(removeImage(index))
    }

    return (
        <div className='flex items-center gap-5'>
            {/* Upload box */}
            <div
                onClick={handleClick}
                className='w-40 h-40 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-100 overflow-hidden relative'
            >
                {images.length > 0 && mode === 'single' ? (
                    <div className='relative w-full h-full'>
                        <Image
                            src={images[0].previewUrl}
                            alt='preview'
                            fill
                            className='object-contain rounded-xl'
                        />
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                handleRemove(0)
                            }}
                            className='absolute top-1 right-1 bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs'
                        >
                            ✕
                        </button>
                    </div>
                ) : (
                    <span className='text-gray-500 text-sm text-center px-2'>
                        {mode === 'single'
                            ? 'Click to upload'
                            : 'Click to add images'}
                    </span>
                )}
            </div>

            {/* Hidden Input */}
            <input
                type='file'
                accept='image/*'
                multiple={mode === 'multiple'}
                ref={inputRef}
                onChange={handleChange}
                className='hidden'
            />

            {/* Multiple previews */}
            {mode === 'multiple' && images.length > 0 && (
                <div className=' grid grid-cols-3 gap-2'>
                    {images.map((img, i) => (
                        <div
                            key={i}
                            className='relative w-40 h-40'
                        >
                            <Image
                                src={img.previewUrl}
                                alt={img.file?.name || 'preview'}
                                fill
                                className='object-cover rounded-md'
                            />
                            <button
                                onClick={() => handleRemove(i, img)}
                                className='absolute top-1 right-1 bg-black/70 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs'
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
