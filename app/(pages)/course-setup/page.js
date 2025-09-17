import CatCard from "@/app/(components)/catCard";


export default function CourseSetup() {
    return (
        <div className='flex gap-8'>
            <div className='w-1/2 rounded-2xl'>
            <CatCard title="Category"  />
            <CatCard title="Sub-Category" />
                
            </div>
            <CatCard title="Class" />
        </div>
    )
}
