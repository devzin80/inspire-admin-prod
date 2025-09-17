import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const quizApi = createApi({
    reducerPath: 'quizApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BASE_API_URL}/quiz`,
    }),
    tagTypes: ['Quiz'], // ✅ define tag group
    endpoints: (builder) => ({
        getQuizzes: builder.query({
            query: () => '/all',
            providesTags: ['Quiz'], // ✅ this query provides the tag
        }),
        getQuizById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'Quiz', id }],
        }),
        createQuiz: builder.mutation({
            query: (chapter) => ({
                url: '/create',
                method: 'POST',
                body: chapter,
            }),
            invalidatesTags: ['Quiz'], // ✅ revalidate after add
        }),
        deleteQuiz: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Quiz'], // ✅ revalidate after delete
        }),
        updateQuiz: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/update/${id}`,
                method: 'PATCH',
                body: {
                    updates: patch,
                },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Quiz', id },
                'Quiz',
            ], // ✅ revalidate this category + the list
        }),
    }),
})

export const {
    useCreateQuizMutation,
    useDeleteQuizMutation,
    useGetQuizByIdQuery,
    useGetQuizzesQuery,
    useUpdateQuizMutation,
} = quizApi
