'use client'
import React, { useState } from 'react'
const {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useDeleteCategoryMutation,
    useUpdateCategoryMutation,
} = require('@/redux/services/category')
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
    useCreateClassMutation,
    useDeleteClassMutation,
    useGetClassesQuery,
    useUpdateClassMutation,
} from '@/redux/services/class'
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
import {
    useCreateSubCategoryMutation,
    useDeleteSubCategoryMutation,
    useGetSubCategoriesQuery,
    useUpdateSubCategoryMutation,
} from '@/redux/services/subCagegory'

const CatCard = ({ title }) => {
    const [formData, setFormData] = useState({})

    // Category API hooks
    const { data: categoryData } = useGetCategoriesQuery()
    const [createCategory] = useCreateCategoryMutation()
    const [deleteCategory] = useDeleteCategoryMutation()
    const [updateCategory] = useUpdateCategoryMutation()

    // Class API hooks
    const [createClass] = useCreateClassMutation()
    const { data: classData } = useGetClassesQuery()
    const [deleteClass] = useDeleteClassMutation()
    const [updateClass] = useUpdateClassMutation()

    // Sub-Category API hooks
    const [createSubCategory] = useCreateSubCategoryMutation()
    const { data: subcategoryData } = useGetSubCategoriesQuery()
    const [deleteSubCategory] = useDeleteSubCategoryMutation()
    const [updateSubCategory] = useUpdateSubCategoryMutation()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (title === 'Category') {
            // Handle category submission logic here
            try {
                if (!formData.category) {
                    toast.error('Category name is required')
                    return
                }

                const res = await createCategory({
                    title: formData.category,
                }).unwrap()
                if (res.success && res.category) {
                    toast.success('Category created successfully')
                    setFormData({})
                } else {
                    toast.error(
                        'Failed to create category with the provided data',
                    )
                }
            } catch (error) {
                toast.error(error.message || 'Failed to create category')
            }
        }

        if (title === 'Class') {
            // Handle class submission logic here
            try {
                if (!formData.class) {
                    toast.error('Class name is required')
                    return
                }

                const res = await createClass({
                    title: formData.class,
                }).unwrap()
                if (res.success && res.class) {
                    toast.success('Class created successfully')
                    setFormData({})
                } else {
                    toast.error('Failed to create class with the provided data')
                }
            } catch (error) {
                toast.error(error.message || 'Failed to create class')
            }
        }
        // console.log('Form Data:', formData)

        if (title == 'Sub-Category') {
        
            
            try {
                const classes = formData?.selectedClasses
                    ? [...formData.selectedClasses]
                    : []
                const res = await createSubCategory({
                    title: formData.subCategory,
                    category: formData.selectedCategory,
                    classes,
                }).unwrap()
                if (res.success && res.subCategory) {
                    toast.success('Sub-Category created successfully')
                    setFormData({})
                } else {
                    toast.error(
                        'Failed to create SubCategory with the provided data',
                    )
                }
            } catch (e) {
                toast.error(e.message || 'Failed to create Sub-Category')
            }
        }
    }

    const handleUpdate = async () => {
        if (title == 'Category') {
            try {
                const res = await updateCategory({
                    id: formData.id,
                    title: formData.category,
                }).unwrap()
                if (res.success) {
                    toast.success('Category updated successfully')
                    setFormData({})
                } else {
                    toast.error('Failed to update category')
                }
            } catch (e) {
                toast.error(`Failed to update category: ${e.message}`)
            }
        }

        if (title == 'Class') {
            // console.log('Updating class with data:', formData)

            try {
                const res = await updateClass({
                    id: formData.id,
                    title: formData.class,
                }).unwrap()
                if (res.success) {
                    toast.success('Class updated successfully')
                    setFormData({})
                } else {
                    toast.error('Failed to update class')
                }
            } catch (e) {
                toast.error(`Failed to update class: ${e.message}`)
            }
        }
        if (title == 'Sub-Category') {
            
            try {
                const res = await updateSubCategory({
                    id: formData.id,
                    title: formData.subCategory,
                    category: formData.selectedCategory,
                    classes: formData.selectedClasses,
                }).unwrap()
                if (res.success) {
                    toast.success('Sub-Category updated successfully')
                    setFormData({})
                } else {
                    toast.error('Failed to update subcategory')
                }
            } catch (e) {
                toast.error(`Failed to update subcategory: ${e.message}`)
            }
        }
    }

    const handleDelete = async (id) => {
        if (title == 'Category') {
            try {
                const res = await deleteCategory(id).unwrap()
                if (res.success) {
                    toast.success('Category deleted successfully')
                } else {
                    toast.error('Failed to delete category')
                }
            } catch (e) {
                toast.error(`Failed to delete category: ${e.message}`)
            }
        }

        if (title == 'Class') {
            try {
                const res = await deleteClass(id).unwrap()
                if (res.success) {
                    toast.success('Class deleted successfully')
                } else {
                    toast.error('Failed to delete class')
                }
            } catch (e) {
                toast.error(`Failed to delete class: ${e.message}`)
            }
        }

        if (title == 'Sub-Category') {
            try {
                const res = await deleteSubCategory(id).unwrap()
                if (res.success) {
                    toast.success('SubCategory deleted successfully')
                } else {
                    toast.error('Failed to delete SubCategory')
                }
            } catch (e) {
                toast.error(`Failed to delete SubCategory: ${e.message}`)
            }
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
        <div
            className={
                title == 'Class'
                    ? 'w-1/2 h-[85vh] rounded-2xl bg-white  p-6'
                    : 'w-full rounded-2xl bg-white p-6 mb-3'
            }
        >
            <div className='flex justify-between w-full'>
                <h1 className='font-semibold py-3'>Create {title} </h1>

                <Dialog>
                    <DialogTrigger asChild>
                        <button className='px-5 py-3 bg-sky-600 rounded-md text-white text-sm font-medium leading-5 cursor-pointer'>
                            Add {title}
                        </button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className='text-2xl mb-2'>
                                Add {title}
                            </DialogTitle>
                        </DialogHeader>
                        {title == 'Category' && (
                            <>
                                <label
                                    htmlFor='Category'
                                    className='font-semibold '
                                >
                                    Category
                                </label>
                                <input
                                    name='category'
                                    onChange={handleChange}
                                    value={formData.category || ''}
                                    type='text'
                                    placeholder='Enter Category Name'
                                    className='w-full p-2 border rounded mb-4'
                                />
                            </>
                        )}
                        {title == 'Class' && (
                            <>
                                <label
                                    htmlFor='Class'
                                    className='font-semibold '
                                >
                                    Class
                                </label>
                                <input
                                    name='class'
                                    onChange={handleChange}
                                    value={formData.class || 'Class '}
                                    type='text'
                                    placeholder='Enter Class Name'
                                    className='w-full p-2 border rounded mb-4'
                                />
                            </>
                        )}
                        {title == 'Sub-Category' && (
                            <>
                                <label
                                    htmlFor='Class'
                                    className='font-semibold '
                                >
                                    Sub-Category
                                </label>
                                <input
                                    name='subCategory'
                                    onChange={handleChange}
                                    value={formData.subCategory || ''}
                                    type='text'
                                    placeholder='Enter Sub-Category Name'
                                    className='w-full p-2 border rounded mb-4'
                                />
                                <label
                                    htmlFor='subCategory'
                                    className=''
                                >
                                    Category
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
                                        <SelectValue placeholder='Select a Category' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {categoryData?.categories?.map(
                                                (cat) => {
                                                    return (
                                                        <SelectItem
                                                            value={cat._id}
                                                            key={cat._id}
                                                        >
                                                            {cat.title}
                                                        </SelectItem>
                                                    )
                                                },
                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
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
                                                        formData?.selectedClasses?.includes(
                                                            cls._id,
                                                        ) || false
                                                    }
                                                    onCheckedChange={(
                                                        checked,
                                                    ) => {
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            selectedClasses:
                                                                checked
                                                                    ? [
                                                                          ...(prev?.selectedClasses ||
                                                                              []),
                                                                          cls._id,
                                                                      ]
                                                                    : prev?.selectedClasses?.filter(
                                                                          (
                                                                              id,
                                                                          ) =>
                                                                              id !==
                                                                              cls._id,
                                                                      ),
                                                        }))
                                                    }}
                                                />
                                                <label> {cls.title} </label>
                                            </div>
                                        )
                                    })}
                                </div>
                            </>
                        )}
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
            <div className='bg-gray-100 flex justify-between items-center p-3 mt-5 rounded'>
                <h1 className='font-semibold w-1/2 '>{title}</h1>
                {title == 'Sub-Category' && (
                    <h1 className='font-semibold w-1/2 '>Category</h1>
                )}
                <h1 className='font-semibold w-1/2 text-center'>Action</h1>
            </div>
            {title == 'Class' && (
                <div className='overflow-y-auto h-[65vh]'>
                    {classData?.classes?.map((cls) => {
                        return (
                            <div key={cls._id}>
                                <div className='flex justify-between items-center p-3 rounded'>
                                    <h1 className='w-1/2'>{cls.title}</h1>
                                    <div className='w-1/2  justify-center items-center gap-2 flex'>
                                        {/* Category Edit Block */}

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <div
                                                    className='cursor-pointer p-2 bg-sky-200 rounded-[99px] justify-center items-center flex'
                                                    onClick={() => {
                                                        setFormData({
                                                            id: cls._id,
                                                            class: cls.title,
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
                                                        Edit {title}
                                                    </DialogTitle>
                                                </DialogHeader>
                                                {title == 'Class' && (
                                                    <>
                                                        <label
                                                            htmlFor='Class'
                                                            className='font-semibold '
                                                        >
                                                            Class
                                                        </label>
                                                        <input
                                                            name='class'
                                                            onChange={
                                                                handleChange
                                                            }
                                                            value={
                                                                formData.class ||
                                                                ''
                                                            }
                                                            type='text'
                                                            placeholder='Enter Category Name'
                                                            className='w-full p-2 border rounded mb-4'
                                                        />
                                                    </>
                                                )}
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <button
                                                            className='px-5 py-3 bg-sky-600 rounded-md text-white text-sm font-medium leading-5 cursor-pointer'
                                                            onClick={
                                                                handleUpdate
                                                            }
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
                                                        Delete this Class?
                                                    </DialogTitle>

                                                    <p className='text-neutral-800'>
                                                        Are you sure you want to
                                                        delete this class? This
                                                        action cannot be undone.
                                                    </p>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <button
                                                            className='px-5 py-3 bg-red-600 rounded-md text-white text-sm font-medium leading-5 cursor-pointer'
                                                            onClick={() =>
                                                                handleDelete(
                                                                    cls._id,
                                                                )
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
            )}
            {title == 'Category' &&
                categoryData?.categories?.map((category) => {
                    return (
                        <div key={category._id}>
                            <div className='flex justify-between items-center p-3 rounded'>
                                <h1 className='w-1/2'>{category.title}</h1>
                                <div className='w-1/2  justify-center items-center gap-2 flex'>
                                    {/* Category Edit Block */}

                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <div
                                                className='cursor-pointer p-2 bg-sky-200 rounded-[99px] justify-center items-center flex'
                                                onClick={() => {
                                                    setFormData({
                                                        id: category._id,
                                                        category:
                                                            category.title,
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
                                                    Edit {title}
                                                </DialogTitle>
                                            </DialogHeader>
                                            {title == 'Category' && (
                                                <>
                                                    <label
                                                        htmlFor='Category'
                                                        className='font-semibold '
                                                    >
                                                        Category
                                                    </label>
                                                    <input
                                                        name='category'
                                                        onChange={handleChange}
                                                        value={
                                                            formData.category ||
                                                            ''
                                                        }
                                                        type='text'
                                                        placeholder='Enter Category Name'
                                                        className='w-full p-2 border rounded mb-4'
                                                    />
                                                </>
                                            )}
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
                                                    Delete this category?
                                                </DialogTitle>

                                                <p className='text-neutral-800'>
                                                    Are you sure you want to
                                                    delete this category? This
                                                    action cannot be undone.
                                                </p>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <button
                                                        className='px-5 py-3 bg-red-600 rounded-md text-white text-sm font-medium leading-5 cursor-pointer'
                                                        onClick={() =>
                                                            handleDelete(
                                                                category._id,
                                                            )
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
            {title == 'Sub-Category' && (
                <div className='overflow-y-auto h-[30vh]'>
                    {subcategoryData?.subCategories?.map((subCat) => {
                        return (
                            <div key={subCat._id}>
                                <div className='flex justify-between items-center p-3 rounded'>
                                    <h1 className='w-1/2'>{subCat.title}</h1>
                                    <h1 className='w-1/2'>
                                        {subCat?.category?.title || ''}
                                    </h1>
                                    <div className='w-1/2  justify-center items-center gap-2 flex'>
                                        {/* Category Edit Block */}

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <div
                                                    className='cursor-pointer p-2 bg-sky-200 rounded-[99px] justify-center items-center flex'
                                                    onClick={() => {
                                                        setFormData({
                                                            id: subCat._id,
                                                            selectedCategory:
                                                                subCat.category,
                                                            selectedClasses: [
                                                                ...subCat.classes,
                                                            ],
                                                            subCategory:
                                                                subCat.title,
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
                                                        Edit {title}
                                                    </DialogTitle>
                                                </DialogHeader>
                                                {title == 'Sub-Category' && (
                                                    <>
                                                        <label
                                                            htmlFor='Class'
                                                            className='font-semibold '
                                                        >
                                                            Sub-Category
                                                        </label>
                                                        <input
                                                            name='subCategory'
                                                            onChange={
                                                                handleChange
                                                            }
                                                            value={
                                                                formData.subCategory ||
                                                                ''
                                                            }
                                                            type='text'
                                                            placeholder='Enter Sub-Category Name'
                                                            className='w-full p-2 border rounded mb-4'
                                                        />
                                                        <label
                                                            htmlFor='subCategory'
                                                            className=''
                                                        >
                                                            Category
                                                        </label>
                                                        <Select
                                                            value={
                                                                formData.selectedCategory ||
                                                                ''
                                                            }
                                                            onValueChange={(
                                                                value,
                                                            ) =>
                                                                setFormData(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        selectedCategory:
                                                                            value,
                                                                    }),
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger className='w-full'>
                                                                <SelectValue placeholder='Select a Category' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    {categoryData?.categories?.map(
                                                                        (
                                                                            cat,
                                                                        ) => {
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
                                                        <label
                                                            htmlFor='subCategory'
                                                            className=''
                                                        >
                                                            Classes (select
                                                            related Classes)
                                                        </label>
                                                        <div className='flex flex-wrap gap-3'>
                                                            {classData?.classes?.map(
                                                                (cls) => {
                                                                    return (
                                                                        <div
                                                                            key={
                                                                                cls._id
                                                                            }
                                                                            className='flex items-center space-x-2'
                                                                        >
                                                                            <Checkbox
                                                                                key={
                                                                                    cls._id
                                                                                }
                                                                                id={
                                                                                    cls._id
                                                                                }
                                                                                checked={
                                                                                    formData?.selectedClasses?.includes(
                                                                                        cls._id,
                                                                                    ) ||
                                                                                    false
                                                                                }
                                                                                onCheckedChange={(
                                                                                    checked,
                                                                                ) => {
                                                                                    setFormData(
                                                                                        (
                                                                                            prev,
                                                                                        ) => ({
                                                                                            ...prev,
                                                                                            selectedClasses:
                                                                                                checked
                                                                                                    ? [
                                                                                                          ...(prev?.selectedClasses ||
                                                                                                              []),
                                                                                                          cls._id,
                                                                                                      ]
                                                                                                    : prev?.selectedClasses?.filter(
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
                                                                            <label>
                                                                                {' '}
                                                                                {
                                                                                    cls.title
                                                                                }{' '}
                                                                            </label>
                                                                        </div>
                                                                    )
                                                                },
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <button
                                                            className='px-5 py-3 bg-sky-600 rounded-md text-white text-sm font-medium leading-5 cursor-pointer'
                                                            onClick={
                                                                handleUpdate
                                                            }
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
                                                        Delete this
                                                        Sub-Category?
                                                    </DialogTitle>

                                                    <p className='text-neutral-800'>
                                                        Are you sure you want to
                                                        delete this category?
                                                        This action cannot be
                                                        undone.
                                                    </p>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <button
                                                            className='px-5 py-3 bg-red-600 rounded-md text-white text-sm font-medium leading-5 cursor-pointer'
                                                            onClick={() =>
                                                                handleDelete(
                                                                    subCat._id,
                                                                )
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
            )}
        </div>
    )
}

export default CatCard
