// 'use client'
// import React, { useState } from 'react'
// import BackBtn from './BackBtn'
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
// import Image from 'next/image'

// const ModelTest = () => {
//     const [formData, setFormData] = useState({})
//     const [questions, setQuestions] = useState([
//         {
//             questionText: '',
//             questionImage: null,
//             answerExplanation: '',
//             timeLimit: null,
//             options: [
//                 { text: '', optionImage: null, isCorrect: false },
//                 { text: '', optionImage: null, isCorrect: false },
//                 { text: '', optionImage: null, isCorrect: false },
//                 { text: '', optionImage: null, isCorrect: false },
//             ],
//         },
//     ])

//     const addQuestion = () => {
//         setQuestions([
//             ...questions,
//             {
//                 questionText: '',
//                 questionImage: null,
//                 answerExplanation: '',
//                 timeLimit: null,
//                 options: [
//                     { text: '', optionImage: null, isCorrect: false },
//                     { text: '', optionImage: null, isCorrect: false },
//                     { text: '', optionImage: null, isCorrect: false },
//                     { text: '', optionImage: null, isCorrect: false },
//                 ],
//             },
//         ])
//     }

//     const handleQuestionChange = (index, field, value) => {
//         const updated = [...questions]
//         updated[index][field] = value
//         setQuestions(updated)
//     }

//     const handleOptionChange = (qIndex, oIndex, field, value) => {
//         const updated = [...questions]
//         updated[qIndex].options[oIndex][field] = value
//         setQuestions(updated)
//     }

//     // Set single correct answer
//     const handleCorrectOption = (qIndex, oIndex) => {
//         const updated = [...questions]
//         updated[qIndex].options.forEach((opt, idx) => {
//             opt.isCorrect = idx === oIndex
//         })
//         setQuestions(updated)
//     }

//     const handleImageUpload = (qIndex, oIndex = null, file) => {
//         const updated = [...questions]
//         const url = URL.createObjectURL(file)

//         if (oIndex === null) {
//             // Question image
//             updated[qIndex].questionImage = url
//         } else {
//             // Option image
//             updated[qIndex].options[oIndex].optionImage = url
//         }
//         setQuestions(updated)
//     }

//     const handleChange = (e) => {
//         const { name, value } = e.target
//         setFormData((prev) => ({
//             ...prev,
//             [name]: value,
//         }))
//     }
//     return (
//         <div>
//             <div className='flex justify-between w-full p-4 items-center'>
//                 <BackBtn />
//                 <button
//                     className='bg-sky-600 text-base font-medium leading-tight px-5 py-3 text-white rounded cursor-pointer'
//                     // onClick={() => {
//                     //     router.push(`${subID}/modeltest`)
//                     // }}
//                 >
//                     Create Model Test
//                 </button>
//             </div>
//             <div className='flex  w-full gap-6 mb-40'>
//                 <div className='w-1/4 rounded-md bg-white p-4'>
//                     <div className='mb-4'>
//                         <label
//                             htmlFor='Class'
//                             className=''
//                         >
//                             Total Time (Minute)
//                         </label>
//                         <input
//                             name='totalTimeLimit'
//                             onChange={handleChange}
//                             value={formData.totalTimeLimit || ''}
//                             type='Number'
//                             placeholder='Enter Total Time'
//                             className='w-full p-2 border rounded mb-4 text-sm'
//                         />
//                     </div>
//                     <div className='mb-4'>
//                         <label>Randomize Question</label>

//                         <RadioGroup
//                             defaultValue={formData.shuffleQuestions || false}
//                             onValueChange={(value) =>
//                                 setFormData((prev) => ({
//                                     ...prev,
//                                     shuffleQuestions: value,
//                                 }))
//                             }
//                             className={'flex ga-3'}
//                         >
//                             <div className='flex items-center space-x-2'>
//                                 <RadioGroupItem
//                                     value={true}
//                                     id='option-one'
//                                 />
//                                 <label htmlFor='option-one'>Yes</label>
//                             </div>
//                             <div className='flex items-center space-x-2'>
//                                 <RadioGroupItem
//                                     value={false}
//                                     id='option-two'
//                                 />
//                                 <label htmlFor='option-two'>No</label>
//                             </div>
//                         </RadioGroup>
//                     </div>
//                     <div className='mb-4'>
//                         <label>Randomize Options</label>

//                         <RadioGroup
//                             defaultValue={formData.shuffleOptions || false}
//                             onValueChange={(value) =>
//                                 setFormData((prev) => ({
//                                     ...prev,
//                                     shuffleOptions: value,
//                                 }))
//                             }
//                             className={'flex ga-3'}
//                         >
//                             <div className='flex items-center space-x-2'>
//                                 <RadioGroupItem
//                                     value={true}
//                                     id='option-one'
//                                 />
//                                 <label htmlFor='option-one'>Yes</label>
//                             </div>
//                             <div className='flex items-center space-x-2'>
//                                 <RadioGroupItem
//                                     value={false}
//                                     id='option-two'
//                                 />
//                                 <label htmlFor='option-two'>No</label>
//                             </div>
//                         </RadioGroup>
//                     </div>
//                 </div>
//                 <div className='w-3/4 rounded-md bg-white p-4'>
//                     <div className='flex justify-between items-center p-6 gap-5'>
//                         <p className='text-xl text-gray-600'>
//                             Add Questions and Answers
//                         </p>
//                         <p className='text-xl font-bold'>
//                             Total Questions: {questions.length}{' '}
//                         </p>
//                     </div>
//                     <div className='p-6 space-y-6'>
//                         {questions.map((q, qIndex) => (
//                             <div
//                                 key={qIndex}
//                                 className='border p-4 rounded-lg shadow space-y-3'
//                             >
//                                 <h2 className='font-semibold text-lg'>
//                                     Question {qIndex + 1}:
//                                 </h2>
//                                 <div className='flex gap-8 items-center'>
//                                     <textarea
//                                         className='border p-2 w-full rounded-md'
//                                         placeholder='Type question here'
//                                         value={q.questionText}
//                                         onChange={(e) =>
//                                             handleQuestionChange(
//                                                 qIndex,
//                                                 'questionText',
//                                                 e.target.value,
//                                             )
//                                         }
//                                     />

//                                     {/* Question Image Upload */}
//                                     <div className='flex items-center gap-4'>
//                                         <label className='cursor-pointer bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md'>
//                                             Upload Image
//                                             <input
//                                                 type='file'
//                                                 accept='image/*'
//                                                 className='hidden'
//                                                 onChange={(e) =>
//                                                     e.target.files[0] &&
//                                                     handleImageUpload(
//                                                         qIndex,
//                                                         null,
//                                                         e.target.files[0],
//                                                     )
//                                                 }
//                                             />
//                                         </label>
//                                         {q.questionImage && (
//                                             <Image
//                                                 src={q.questionImage}
//                                                 alt='question preview'
//                                                 width={200}
//                                                 height={200}
//                                                 className='w-32 h-20 object-cover rounded-md border'
//                                             />
//                                         )}
//                                     </div>
//                                 </div>

//                                 <div className='mt-4 space-y-2'>
//                                     <h3 className='font-semibold'>
//                                         Answer Options:
//                                     </h3>
//                                     {q.options.map((option, oIndex) => (
//                                         <div
//                                             key={oIndex}
//                                             className='flex gap-2 items-center'
//                                         >
//                                             {/* Single correct answer radio */}
//                                             <input
//                                                 type='radio'
//                                                 name={`correctOption-${qIndex}`}
//                                                 checked={option.isCorrect}
//                                                 onChange={() =>
//                                                     handleCorrectOption(
//                                                         qIndex,
//                                                         oIndex,
//                                                     )
//                                                 }
//                                             />

//                                             <input
//                                                 type='text'
//                                                 placeholder='Option Text'
//                                                 className='border p-1 flex-1 rounded-md'
//                                                 value={option.text}
//                                                 onChange={(e) =>
//                                                     handleOptionChange(
//                                                         qIndex,
//                                                         oIndex,
//                                                         'text',
//                                                         e.target.value,
//                                                     )
//                                                 }
//                                             />

//                                             {/* Option Image Upload */}
//                                             <label className='cursor-pointer bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-md'>
//                                                 Upload
//                                                 <input
//                                                     type='file'
//                                                     accept='image/*'
//                                                     className='hidden'
//                                                     onChange={(e) =>
//                                                         e.target.files[0] &&
//                                                         handleImageUpload(
//                                                             qIndex,
//                                                             oIndex,
//                                                             e.target.files[0],
//                                                         )
//                                                     }
//                                                 />
//                                             </label>

//                                             {option.optionImage && (
//                                                 <img
//                                                     src={option.optionImage}
//                                                     alt='option preview'
//                                                     className='w-16 h-16 object-cover rounded-md border'
//                                                 />
//                                             )}
//                                         </div>
//                                     ))}
//                                 </div>
//                                 <input
//                                     type='text'
//                                     placeholder='Answer Explanation'
//                                     className='border p-1 w-full rounded-md'
//                                     value={q.answerExplanation}
//                                     onChange={(e) =>
//                                         handleQuestionChange(
//                                             qIndex,
//                                             'answerExplanation',
//                                             e.target.value,
//                                         )
//                                     }
//                                 />
//                             </div>
//                         ))}

//                         <button
//                             className='bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700'
//                             onClick={addQuestion}
//                         >
//                             Add Question
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default ModelTest

'use client'
import React, { useState } from 'react'
import QuizEditor from './QuizEditor'
import Image from 'next/image'
import { useCreateQuizMutation } from '@/redux/services/quiz'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'


const QuizBuilder = ({ subject }) => {
    const [createQuiz] = useCreateQuizMutation()
    const router = useRouter()
    const [quizData, setQuizData] = useState({
        title: '',
        slug: '',
        description: '',
        quizType: 'quiz',
        preview: false,
        totalTimeLimit: '',
        shuffleQuestions: false,
        shuffleOptions: false,
        questions: [],
    })

    // ✅ Add new question
    const addQuestion = () => {
        setQuizData((prev) => ({
            ...prev,
            questions: [
                ...prev.questions,
                {
                    questionText: '',
                    questionImage: '',
                    options: [
                        { text: '', optionImage: '', isCorrect: false },
                        { text: '', optionImage: '', isCorrect: false },
                        { text: '', optionImage: '', isCorrect: false },
                        { text: '', optionImage: '', isCorrect: false },
                    ],
                    answerExplanation: '',
                },
            ],
        }))
    }

    // ✅ Update question text
    const handleQuestionChange = (index, value) => {
        const newQuestions = [...quizData.questions]
        newQuestions[index].questionText = value
        setQuizData({ ...quizData, questions: newQuestions })
    }

    // ✅ Update option text
    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...quizData.questions]
        newQuestions[qIndex].options[oIndex].text = value
        setQuizData({ ...quizData, questions: newQuestions })
    }

    // ✅ Mark correct option (radio)
    const handleCorrectOption = (qIndex, oIndex) => {
        const newQuestions = [...quizData.questions]
        newQuestions[qIndex].options.forEach((opt, i) => {
            opt.isCorrect = i === oIndex
        })
        setQuizData({ ...quizData, questions: newQuestions })
    }

    // ✅ Update answer explanation
    const handleAnswerExplanationChange = (qIndex, value) => {
        const newQuestions = [...quizData.questions]
        newQuestions[qIndex].answerExplanation = value
        setQuizData({ ...quizData, questions: newQuestions })
    }

    // ✅ Add option
    const addOption = (qIndex) => {
        const newQuestions = [...quizData.questions]
        newQuestions[qIndex].options.push({
            text: '',
            optionImage: '',
            isCorrect: false,
        })
        setQuizData({ ...quizData, questions: newQuestions })
    }

    // ✅ Upload image (question/option)
    const handleImageUpload = async (event, qIndex, oIndex = null) => {
        const file = event.target.files[0]
        if (!file) return

        try {
            const formData = new FormData()
            formData.append('images', file)

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/image-upload`,
                {
                    method: 'POST',
                    body: formData,
                },
            )

            if (!res.ok) throw new Error('Image upload failed')
            const data = await res.json()
            const uploadedUrl = data.urls[0]

            setQuizData((prev) => {
                const newQuestions = [...prev.questions]
                if (oIndex === null) {
                    newQuestions[qIndex].questionImage = uploadedUrl
                } else {
                    newQuestions[qIndex].options[oIndex].optionImage =
                        uploadedUrl
                }
                return { ...prev, questions: newQuestions }
            })
        } catch (err) {
            console.error('Upload error:', err)
            alert('Image upload failed')
        }
    }

    // ✅ Submit quiza
    const handleSubmit = async () => {
        const payload = {
            subject,
            ...quizData,
        }

        try {
            const newQuiz = await createQuiz(payload).unwrap()
            if (!newQuiz) return toast.error('Failed to create Quiz')
            toast.success('Quiz Created Successfully')
            router.back()
        } catch (e) {
            toast.error(e.message)
        }
    }

    return (
        <div className='max-w-5xl mx-auto p-8 bg-gray-50 min-h-screen'>
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl font-bold mb-6 text-gray-800'>
                    Quiz Builder
                </h1>
                <h1 className='text-3xl font-bold mb-6 text-gray-800'>
                    Total : {quizData.questions.length}
                </h1>
            </div>

            {/* Quiz Info */}
            {/* Quiz Info */}
            <div className='bg-white p-6 rounded-2xl shadow-md mb-8 space-y-5'>
                <input
                    type='text'
                    placeholder='Quiz Title'
                    value={quizData.title}
                    onChange={(e) =>
                        setQuizData({ ...quizData, title: e.target.value })
                    }
                    className='w-full border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none'
                />

                <input
                    type='text'
                    placeholder='Quiz Slug'
                    value={quizData.slug}
                    onChange={(e) =>
                        setQuizData({
                            ...quizData,
                            slug: e.target.value,
                        })
                    }
                    className='w-full border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none'
                />

                <div className='flex items-center gap-4'>
                    <label className='font-semibold text-gray-700'>
                        Quiz Type:
                    </label>
                    <select
                        value={quizData.quizType}
                        onChange={(e) =>
                            setQuizData({
                                ...quizData,
                                quizType: e.target.value,
                            })
                        }
                        className='border rounded-xl p-2 shadow-sm'
                    >
                        <option value='quiz'>Quiz</option>
                        <option value='modelTest'>Model Test</option>
                    </select>
                </div>

                {/* Total Questions */}
                {/* <div>
                    <label className='font-semibold text-gray-700 block mb-1'>
                        Total Questions:
                    </label>
                    <input
                        type='number'
                        min='1'
                        value={quizData.totalQuestions || ''}
                        onChange={(e) =>
                            setQuizData({
                                ...quizData,
                                totalQuestions: parseInt(e.target.value) || 0,
                            })
                        }
                        className='w-40 border rounded-xl p-2 shadow-sm'
                    />
                </div> */}

                {/* Total Time Limit */}
                <div>
                    <label className='font-semibold text-gray-700 block mb-1'>
                        Total Time Limit (minutes):
                    </label>
                    <input
                        type='number'
                        min='1'
                        value={quizData.totalTimeLimit || ''}
                        onChange={(e) =>
                            setQuizData({
                                ...quizData,
                                totalTimeLimit: parseInt(e.target.value) || 0,
                            })
                        }
                        className='w-40 border rounded-xl p-2 shadow-sm'
                    />
                </div>

                {/* Toggles */}
                <div className='flex flex-wrap gap-6 mt-3'>
                    <label className='flex items-center gap-2'>
                        <input
                            type='checkbox'
                            checked={quizData.shuffleQuestions}
                            onChange={(e) =>
                                setQuizData({
                                    ...quizData,
                                    shuffleQuestions: e.target.checked,
                                })
                            }
                            className='h-4 w-4'
                        />
                        Randomize Questions
                    </label>

                    <label className='flex items-center gap-2'>
                        <input
                            type='checkbox'
                            checked={quizData.shuffleOptions}
                            onChange={(e) =>
                                setQuizData({
                                    ...quizData,
                                    shuffleOptions: e.target.checked,
                                })
                            }
                            className='h-4 w-4'
                        />
                        Randomize Options
                    </label>

                    <label className='flex items-center gap-2'>
                        <input
                            type='checkbox'
                            checked={quizData.preview}
                            onChange={(e) =>
                                setQuizData({
                                    ...quizData,
                                    preview: e.target.checked,
                                })
                            }
                            className='h-4 w-4'
                        />
                        Preview Mode
                    </label>
                </div>
            </div>

            {/* Questions */}
            {quizData.questions.map((q, qIndex) => (
                <div
                    key={qIndex}
                    className='bg-white p-6 rounded-2xl shadow-md mb-8'
                >
                    <h2 className='text-xl font-semibold mb-4 text-gray-700'>
                        Question {qIndex + 1}
                    </h2>

                    {/* Question Text */}
                    <QuizEditor
                        value={q.questionText}
                        onChange={(val) => handleQuestionChange(qIndex, val)}
                        height={200}
                    />

                    {/* Question Image */}
                    <div className='mt-3'>
                        <input
                            type='file'
                            accept='image/*'
                            onChange={(e) => handleImageUpload(e, qIndex)}
                            className='block w-full text-sm text-gray-600
                                       file:mr-4 file:py-2 file:px-4
                                       file:rounded-full file:border-0
                                       file:text-sm file:font-semibold
                                       file:bg-blue-50 file:text-blue-600
                                       hover:file:bg-blue-100'
                        />
                        {q.questionImage && (
                            <Image
                                src={`${process.env.NEXT_PUBLIC_FRONTEND_URL}${q.questionImage}`}
                                alt='Question'
                                width={200}
                                height={200}
                                className='mt-2 w-40 h-40 object-cover rounded-lg shadow-sm'
                            />
                        )}
                    </div>

                    {/* Options */}
                    <div className='mt-4 space-y-4'>
                        <h2 className='text-xl font-semibold mb-4 text-gray-700'>
                            Options
                        </h2>
                        {q.options.map((o, oIndex) => (
                            <div
                                key={oIndex}
                                className='flex items-start gap-3 border p-3 rounded-xl shadow-sm'
                            >
                                <input
                                    type='radio'
                                    name={`correct-${qIndex}`}
                                    checked={o.isCorrect}
                                    onChange={() =>
                                        handleCorrectOption(qIndex, oIndex)
                                    }
                                    className='mt-2'
                                />
                                <div className='flex-1'>
                                    <QuizEditor
                                        value={o.text}
                                        height={100}
                                        onChange={(val) =>
                                            handleOptionChange(
                                                qIndex,
                                                oIndex,
                                                val,
                                            )
                                        }
                                    />

                                    {/* Option Image */}
                                    <input
                                        type='file'
                                        accept='image/*'
                                        onChange={(e) =>
                                            handleImageUpload(e, qIndex, oIndex)
                                        }
                                        className='mt-2 block w-full text-sm text-gray-600
                                                   file:mr-4 file:py-2 file:px-4
                                                   file:rounded-full file:border-0
                                                   file:text-sm file:font-semibold
                                                   file:bg-green-50 file:text-green-600
                                                   hover:file:bg-green-100'
                                    />
                                    {o.optionImage && (
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_FRONTEND_URL}${o.optionImage}`}
                                            unoptimized
                                            alt='Option'
                                            width={96}
                                            height={96}
                                            className='mt-2 w-24 h-24 object-cover rounded-lg shadow'
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Answer Explanation */}
                    <div className='mt-4'>
                        <label className='font-semibold text-gray-700'>
                            Answer Explanation:
                        </label>
                        <QuizEditor
                            value={q.answerExplanation}
                            onChange={(val) =>
                                handleAnswerExplanationChange(qIndex, val)
                            }
                        />
                    </div>
                </div>
            ))}

            {/* Buttons */}
            <div className='flex gap-4 mb-14'>
                <button
                    onClick={addQuestion}
                    className='px-5 py-3 bg-blue-500 text-white rounded-xl shadow hover:bg-blue-600 transition'
                >
                    ➕ Add Question
                </button>
                <button
                    onClick={handleSubmit}
                    className='px-5 py-3 bg-purple-500 text-white rounded-xl shadow hover:bg-purple-600 transition'
                >
                    💾 Save Quiz
                </button>
            </div>
        </div>
    )
}

export default QuizBuilder
