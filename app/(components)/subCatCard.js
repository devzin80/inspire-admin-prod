import React from 'react'
import SubjectCard from './subjectCard'

const SubCatCard = ({ subject }) => {
    // console.log(subject)

    const { title, classes, subjects, _id: id } = subject
    return (
        <div className='p-6 '>
            <h1 className='w-full text-base font-semibold mb-1 border-b-2 leading-loose text-neutral-700'>
                {title}
            </h1>
            <div
                className={`flex ${
                    subjects.length > 2 ? 'justify-between' : 'justify-start'
                } items-center gap-6 flex-wrap w-full `}
            >
                {subjects.length == 0 && (
                    <div className='w-full text-5xl text-zinc-500 min-h-[400px] text-center flex justify-center items-center'>
                        No Subjects Added.
                    </div>
                )}
                {subjects?.map((sub, index) => {
                    return (
                        <SubjectCard
                            key={index}
                            subject={sub}
                        />
                    )
                })}
               
            </div>
        </div>
    )
}

export default SubCatCard
