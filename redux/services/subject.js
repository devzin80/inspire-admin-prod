import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const subjectApi = createApi({
    reducerPath: 'subjectApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BASE_API_URL}/subject`,
    }),
    tagTypes: ['Subject'], // ✅ define tag group
    endpoints: (builder) => ({
        getSubjects: builder.query({
            query: () => '/all',
            providesTags: ['Subject'], // ✅ this query provides the tag
        }),
        getSubjectById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'Subject', id }],
        }),
        createSubject: builder.mutation({
            query: (subject) => ({
                url: '/create',
                method: 'POST',
                body: subject,
            }),
            invalidatesTags: ['Subject'], // ✅ revalidate after add
        }),
        deleteSubject: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Subject'], // ✅ revalidate after delete
        }),
        updateSubject: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/update/${id}`,
                method: 'PATCH',
                body: {
                    updates: patch,
                },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Subject', id },
                'Subject',
            ], // ✅ revalidate this category + the list
        }),
    }),
})

export const {
    useGetSubjectsQuery,
    useGetSubjectByIdQuery,
    useCreateSubjectMutation,
    useDeleteSubjectMutation,
    useUpdateSubjectMutation,
} = subjectApi
