'use client'
import { useDeleteBookMutation, useGetBooksQuery } from '@/redux/services/book'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
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
import { useDispatch } from 'react-redux'
import { addImage, clearImages, setMode } from '@/redux/slices/imageSlice'

export default function Books() {
    const router = useRouter()
    const dispatch = useDispatch()
    const { data: bookData } = useGetBooksQuery()
    const [deleteBook] = useDeleteBookMutation()

    const handleDelete = async (id) => {
        try {
            const res = await deleteBook(id).unwrap()
            if (res.success) {
                toast.success('Book deleted successfully')
            } else {
                toast.error('Failed to delete the book')
            }
        } catch (error) {
            toast.error('An error occurred while deleting the book')
        }
    }

    return (
        <div className='w-full self-stretch bg-white overflow-hidden rounded-2xl border border-gray-200 flex-col justify-start items-start flex'>
            <div className='w-full px-5 py-6 bg-white justify-start items-center gap-2 inline-flex'>
                <div className='grow shrink basis-0 justify-between items-center flex'>
                    <div className='flex-col justify-start items-start gap-1 inline-flex'>
                        <div className="w-[168px] text-gray-700 text-base font-semibold font-['Inter'] leading-normal">
                            Book List
                        </div>
                        <div className="self-stretch text-gray-400 text-xs font-medium font-['Inter'] leading-none">
                            All Books Here
                        </div>
                    </div>

                    <button
                        className='px-5 py-3 bg-sky-600 rounded-md text-white text-sm font-medium leading-5 cursor-pointer'
                        onClick={() => {
                            router.push(`/books/add-book`)
                            dispatch(clearImages())
                            dispatch(setMode('multiple'))
                        }}
                    >
                        Add Book
                    </button>
                </div>
            </div>

            {/* table here */}

            <div className='w-full h-[52px] px-6 py-2 bg-gray-100 border-b-2 border-gray-100 justify-start items-center gap-2 inline-flex'>
                <div className=' grid grid-cols-5 grow shrink basis-0 h-9 justify-between items-center '>
                    <div className='h-9 py-2 justify-start items-center gap-2 flex'>
                        <div className="text-gray-700 text-sm font-semibold font-['Inter'] leading-tight">
                            Title
                        </div>
                    </div>
                    <div className='h-9 py-2 justify-center items-center gap-2 flex'>
                        <div className="text-gray-700 text-sm font-semibold font-['Inter'] leading-tight">
                            Sub Category
                        </div>
                    </div>
                    <div className='h-9 py-2 justify-center items-center gap-2 flex'>
                        <div className="text-gray-700 text-sm font-semibold font-['Inter'] leading-tight">
                            Class
                        </div>
                    </div>
                    <div className='h-9 py-2 justify-center items-center gap-2 flex'>
                        <div className="text-gray-700 text-sm font-semibold font-['Inter'] leading-tight">
                            Price
                        </div>
                    </div>
                    <div className='h-9 py-2 justify-center items-center gap-2 flex'>
                        <div className="text-gray-700 text-sm font-semibold font-['Inter'] leading-tight">
                            Action
                        </div>
                    </div>
                </div>
            </div>

            {/* Book loop here */}
            {bookData?.books?.length == 0 && (
                <div className='w-full text-5xl text-zinc-500 min-h-[400px] text-center flex justify-center items-center'>
                    No Books Added.
                </div>
            )}

            {bookData?.books?.map((book, index) => {
                return (
                    <div
                        className='w-full h-[68px] px-6 py-2 bg-white border-b border-gray-100 justify-start items-center gap-2 inline-flex'
                        key={index}
                    >
                        <div className='grid grid-cols-5 grow shrink basis-0 h-[52px] justify-between items-center '>
                            <div className='h-[52px] py-4 justify-start items-center gap-2 flex'>
                                <div className="text-gray-700 text-sm font-medium font-['Inter'] leading-tight">
                                    {book?.title}
                                </div>
                            </div>
                            <div className='h-[52px] py-4 justify-center items-center gap-2 flex'>
                                <div className="text-gray-700 text-sm font-medium font-['Inter'] leading-tight">
                                    {book?.subcategory?.title}
                                </div>
                            </div>
                            <div className='h-[52px] py-4 justify-center items-center gap-2 flex'>
                                <div className="text-gray-700 text-sm font-medium font-['Inter'] leading-tight">
                                    {book?.class?.title || ' '}
                                </div>
                            </div>
                            <div className='h-[52px] py-4 justify-center items-center gap-2 flex'>
                                <div className="text-gray-700 text-sm font-medium font-['Inter'] leading-tight">
                                    {`৳ ${book.price}`}
                                </div>
                            </div>
                            <div className=' h-[52px] justify-center items-center gap-2 flex'>
                                <div
                                    onClick={() => {
                                        dispatch(setMode('multiple'))

                                        // 2️⃣ Preload images into Redux
                                        book?.images?.forEach((imgUrl) => {
                                            const img = `${process.env.NEXT_PUBLIC_FRONTEND_URL}${imgUrl}`
                                            dispatch(
                                                addImage({
                                                    previewUrl: img, // URL for the <Image /> preview
                                                    file: null, // no File object for already uploaded images
                                                }),
                                            )
                                        })

                                        router.push(
                                            `/books/update-book/${book._id}`,
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
                                                    onClick={() =>
                                                        handleDelete(book._id)
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
                    </div>
                )
            })}
        </div>
    )
}
