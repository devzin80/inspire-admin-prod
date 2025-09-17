'use client'
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useState } from 'react'
import { useGetClassesQuery } from '@/redux/services/class'
import {
    useCreateCouponMutation,
    useDeleteCouponMutation,
    useGetCouponsQuery,
    useUpdateCouponMutation,
} from '@/redux/services/coupon'
export default function Notification() {
    const [formData, setFormData] = useState({})
    const { data: classData } = useGetClassesQuery()
    const { data: CouponData } = useGetCouponsQuery()
    const [createCoupon] = useCreateCouponMutation()
    const [deleteCoupon] = useDeleteCouponMutation()
    const [updateCoupon] = useUpdateCouponMutation()
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleUpdate = async () => {
        const data = {
            id: formData._id,
            ...formData
        }
        
        try {
            const updated = await updateCoupon(data).unwrap()
            if (!updated) {
                toast.error('Failed to delete Coupon')
                return
            }

            toast.success('Coupon Updated Successfully.')
            setFormData({})
        } catch (e) {
            toast.error(e.message)
        }
    }

    const handleDelete = async (id) => {
        try {
            const deleted = await deleteCoupon(id)
            if (!deleted) {
                toast.error('Failed to delete Coupon')
                return
            }

            toast.success('Coupon Deleted Successfully.')
            setFormData({})
        } catch (e) {
            toast.error(e.message)
        }
    }
    const handleSubmit = async () => {
        try {
            const newCoupon = await createCoupon({ ...formData }).unwrap()
            if (!newCoupon) {
                toast.error('Coupon not created.')
                return
            }

            toast.success('Successfully Created Coupon. ')
            setFormData({})
        } catch (e) {
            toast.error(e.message)
        }
    }
    return (
        <div className='w-full self-stretch bg-white overflow-hidden rounded-2xl border border-gray-200 flex-col justify-start items-start flex'>
            <div className='w-full px-5 py-6 bg-white justify-start items-center gap-2 inline-flex'>
                <div className='grow shrink basis-0 justify-between items-center flex'>
                    <div className='flex-col justify-start items-start gap-1 inline-flex'>
                        <div className="w-[168px] text-gray-700 text-base font-semibold font-['Inter'] leading-normal">
                            Notification List
                        </div>
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <button
                                className='px-5 py-3 bg-sky-600 rounded-md text-white text-sm font-medium leading-5 cursor-pointer'
                                onClick={() => {}}
                            >
                                Create Notification
                            </button>
                        </DialogTrigger>

                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className='text-2xl mb-2'>
                                    Create Notification
                                </DialogTitle>
                            </DialogHeader>

                            <label
                                htmlFor='Category'
                                className='font-semibold '
                            >
                                Write Notification
                            </label>
                            <textarea
                                name='body'
                                onChange={handleChange}
                                value={formData.body || ''}
                                type='text'
                                placeholder='Enter Coupon code'
                                className='w-full h-full p-2 border rounded mb-4'
                            />
                            <label
                                htmlFor='subCategory'
                                className='font-semibold'
                            >
                                Class
                            </label>
                            <div className='w-1/2'>
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
                                            {classData?.classes?.map((cls) => {
                                                return (
                                                    <div key={cls._id}>
                                                        <SelectItem
                                                            value={cls._id}
                                                        >
                                                            {cls.title}
                                                        </SelectItem>
                                                    </div>
                                                )
                                            })}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='flex justify-between gap-4'>
                                <div className='w-1/3'>
                                    <label
                                        htmlFor='Category'
                                        className='font-semibold '
                                    >
                                        Status
                                    </label>
                                    <Select
                                        value={formData.status || ''}
                                        onValueChange={(value) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                status: value,
                                            }))
                                        }
                                    >
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select Status' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value={'start'}>
                                                    Start
                                                </SelectItem>
                                                <SelectItem value={'stop'}>
                                                    Stop
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

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
            </div>

            <div className='w-full h-[52px] px-6 py-2 bg-gray-100 border-b-2 border-gray-100 justify-start items-center gap-2 inline-flex'>
                <div className=' grid grid-cols-7 grow shrink basis-0 h-9 justify-between items-center '>
                    <div className='h-9 py-2 justify-start items-center gap-2 flex'>
                        <div className="text-gray-700 text-sm font-semibold font-['Inter'] leading-tight">
                            Date
                        </div>
                    </div>
                    <div className='h-9  col-span-3 py-2 justify-center items-center gap-2 flex'>
                        <div className="text-gray-700 text-sm font-semibold font-['Inter'] leading-tight">
                            Notification
                        </div>
                    </div>

                    <div className='h-9 py-2 justify-center items-center gap-2 flex'>
                        <div className="text-gray-700 text-sm font-semibold font-['Inter'] leading-tight">
                            Class
                        </div>
                    </div>

                    <div className='h-9 py-2 justify-center items-center gap-2 flex'>
                        <div className="text-gray-700 text-sm font-semibold font-['Inter'] leading-tight">
                            Status
                        </div>
                    </div>
                    <div className='h-9 py-2 justify-center items-center gap-2 flex'>
                        <div className="text-gray-700 text-sm font-semibold font-['Inter'] leading-tight">
                            Action
                        </div>
                    </div>
                </div>
            </div>

            {/* Coupon Loop Here */}

            {CouponData?.coupons?.map((coupon, index) => (
                <div
                    className='w-full h-[52px] px-6 py-2 bg-white border-b-2 border-gray-100 justify-start items-center gap-2 inline-flex'
                    key={index}
                >
                    <div className=' grid grid-cols-7 grow shrink basis-0 h-9 justify-between items-center '>
                        <div className='h-9 py-2 justify-start items-center gap-2 flex'>
                            <div className="text-gray-700 text-sm font-semibold font-['Inter'] leading-tight">
                                {/* {new Date(coupon.createdAt).toLocaleDateString(
                                    'en-GB',
                                )} */}
                            </div>
                        </div>
                        <div className='h-9 col-span-3 py-2 justify-center items-center gap-2 flex'>
                            <div className="text-gray-700 text-sm font-semibold font-['Inter'] leading-tight">
                                {/* {.body} */}
                            </div>
                        </div>

                        <div className='h-9 py-2 justify-start items-center gap-2 flex'>
                            <div className="text-gray-700 text-sm font-semibold font-['Inter'] leading-tight">
                                {/* {new Date(coupon.createdAt).toLocaleDateString(
                                    'en-GB',
                                )} */}
                            </div>
                        </div>

                        <div className='h-9 py-2 justify-center items-center gap-2 flex'>
                            <div className="text-gray-700 text-sm font-semibold font-['Inter'] leading-tight">
                                {coupon.status == 'start' ? (
                                    <p className='bg-green-100 text-green-500 px-3 py-1 border-green-300 border rounded'>
                                        Running
                                    </p>
                                ) : (
                                    <p className='bg-red-100 text-red-500 px-3 py-1 border-red-300 border rounded'>
                                        Pause
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className='  justify-center items-center gap-2 flex'>
                            {/* Category Edit Block */}

                            <Dialog>
                                <DialogTrigger asChild>
                                    <div
                                        className='cursor-pointer p-2 bg-sky-200 rounded-[99px] justify-center items-center flex'
                                        onClick={() => {
                                            setFormData({
                                                ...coupon,
                                            })
                                        }}
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
                                            Add Coupon
                                        </DialogTitle>
                                    </DialogHeader>

                                    <label>Applied To</label>

                                    <RadioGroup
                                        defaultValue={formData.couponFor || ''}
                                        onValueChange={(value) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                couponFor: value,
                                            }))
                                        }
                                        className={'flex ga-3'}
                                    >
                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem
                                                value='book'
                                                id='option-one'
                                            />
                                            <label htmlFor='option-one'>
                                                Book
                                            </label>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem
                                                value='course'
                                                id='option-two'
                                            />
                                            <label htmlFor='option-two'>
                                                Course
                                            </label>
                                        </div>
                                    </RadioGroup>
                                    <label
                                        htmlFor='Category'
                                        className='font-semibold '
                                    >
                                        Coupon Code
                                    </label>
                                    <input
                                        name='coupon'
                                        onChange={handleChange}
                                        value={formData.coupon || ''}
                                        type='text'
                                        placeholder='Enter Coupon code'
                                        className='w-full p-2 border rounded mb-4'
                                    />
                                    <label
                                        htmlFor='subCategory'
                                        className=''
                                    >
                                        Classes (select related Classes)
                                    </label>
                                    <div className='flex flex-wrap gap-3'>
                                        {classData?.classes?.map((cls) => {
                                            return (
                                                <div
                                                    key={cls._id}
                                                    className='flex items-center space-x-2'
                                                >
                                                    <Checkbox
                                                        key={cls._id}
                                                        id={cls._id}
                                                        checked={
                                                            formData?.applyToClasses?.includes(
                                                                cls._id,
                                                            ) || false
                                                        }
                                                        onCheckedChange={(
                                                            checked,
                                                        ) => {
                                                            setFormData(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    applyToClasses:
                                                                        checked
                                                                            ? [
                                                                                  ...(prev?.applyToClasses ||
                                                                                      []),
                                                                                  cls._id,
                                                                              ]
                                                                            : prev?.applyToClasses?.filter(
                                                                                  (
                                                                                      id,
                                                                                  ) =>
                                                                                      id !==
                                                                                      cls._id,
                                                                              ),
                                                                }),
                                                            )
                                                        }}
                                                    />
                                                    <label> {cls.title} </label>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div className='flex justify-between gap-4'>
                                        <div>
                                            <label
                                                htmlFor='Category'
                                                className='font-semibold '
                                            >
                                                Value
                                            </label>
                                            <input
                                                name='value'
                                                onChange={handleChange}
                                                value={formData.value || ''}
                                                type='text'
                                                placeholder='Enter Value '
                                                className='w-full p-2 border rounded mb-4'
                                            />
                                        </div>
                                        <div className='w-1/3'>
                                            <label
                                                htmlFor='Category'
                                                className='font-semibold '
                                            >
                                                Unit
                                            </label>
                                            <Select
                                                value={formData.unit || ''}
                                                onValueChange={(value) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        unit: value,
                                                    }))
                                                }
                                            >
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem
                                                            value={'percent'}
                                                        >
                                                            Percent
                                                        </SelectItem>
                                                        <SelectItem
                                                            value={'taka'}
                                                        >
                                                            Taka
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label
                                                htmlFor='Category'
                                                className='font-semibold '
                                            >
                                                Min Purchase (BDT)
                                            </label>
                                            <input
                                                name='minPurchase'
                                                onChange={handleChange}
                                                value={
                                                    formData.minPurchase || ''
                                                }
                                                type='text'
                                                placeholder='Enter minimum purchase'
                                                className='w-full p-2 border rounded mb-4'
                                            />
                                        </div>
                                    </div>
                                    <div className='flex justify-between gap-3'>
                                        <div>
                                            <label
                                                htmlFor='Category'
                                                className='font-semibold '
                                            >
                                                Start Date
                                            </label>
                                            <input
                                                name='startDate'
                                                onChange={handleChange}
                                                value={
                                                    formData.startDate
                                                        ? new Date(
                                                              formData.startDate,
                                                          )
                                                              .toISOString()
                                                              .split('T')[0] // ✅ format to YYYY-MM-DD
                                                        : ''
                                                }
                                                type='Date'
                                                placeholder='Enter Value '
                                                className='w-full p-2 border rounded mb-4'
                                            />
                                        </div>
                                        <div>
                                            {' '}
                                            <label
                                                htmlFor='Category'
                                                className='font-semibold '
                                            >
                                                End Date
                                            </label>
                                            <input
                                                name='endDate'
                                                onChange={handleChange}
                                                value={
                                                    formData.endDate
                                                        ? new Date(
                                                              formData.endDate,
                                                          )
                                                              .toISOString()
                                                              .split('T')[0] // ✅ format to YYYY-MM-DD
                                                        : ''
                                                }
                                                type='Date'
                                                placeholder='Enter Value '
                                                className='w-full p-2 border rounded mb-4'
                                            />
                                        </div>
                                        <div className='w-1/3'>
                                            <label
                                                htmlFor='Category'
                                                className='font-semibold '
                                            >
                                                Status
                                            </label>
                                            <Select
                                                value={formData.status || ''}
                                                onValueChange={(value) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        status: value,
                                                    }))
                                                }
                                            >
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem
                                                            value={'start'}
                                                        >
                                                            Start
                                                        </SelectItem>
                                                        <SelectItem
                                                            value={'stop'}
                                                        >
                                                            Stop
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

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

                            {/* Category Delete Block */}

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
                                            Delete this Coupon?
                                        </DialogTitle>

                                        <p className='text-neutral-800'>
                                            Are you sure you want to delete this
                                            Coupon? This action cannot be
                                            undone.
                                        </p>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <button
                                                className='px-5 py-3 bg-red-600 rounded-md text-white text-sm font-medium leading-5 cursor-pointer'
                                                onClick={() =>
                                                    handleDelete(coupon._id)
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
            ))}
        </div>
    )
}
