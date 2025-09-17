'use client'
import CourseCard from '@/app/(components)/courseCard'
import { useGetCategoriesQuery } from '@/redux/services/category'

export default function CourseUpload() {
    const { data: Categories } = useGetCategoriesQuery()
    // console.log(Categories)

    return (
        <div className='h-screen overflow-auto '>
            <h1 className='text-2xl font-semibold leading-loose mb-8'>
                Course List
            </h1>
            {Categories?.categories?.map((cat) => {
                return (
                    <CourseCard
                        key={cat._id}
                        title={cat.title}
                        subCat={cat.subcategories}
                    />
                )
            })}
        </div>
    )
}
