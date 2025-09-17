import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const noteApi = createApi({
    reducerPath: 'noteApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BASE_API_URL}/note`,
    }),
    tagTypes: ['Note'], // ✅ define tag group
    endpoints: (builder) => ({
        getNotes: builder.query({
            query: () => '/all',
            providesTags: ['Note'], // ✅ this query provides the tag
        }),
        getNoteById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'Note', id }],
        }),
        createNote: builder.mutation({
            query: (chapter) => ({
                url: '/create',
                method: 'POST',
                body: chapter,
            }),
            invalidatesTags: ['Note'], // ✅ revalidate after add
        }),
        deleteNote: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Note'], // ✅ revalidate after delete
        }),
        updateNote: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/update/${id}`,
                method: 'PATCH',
                body: {
                    updates: patch,
                },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Note', id },
                'Note',
            ], // ✅ revalidate this category + the list
        }),
    }),
})

export const {
    useGetNotesQuery,
    useGetNoteByIdQuery,
    useCreateNoteMutation,
    useDeleteNoteMutation,
    useUpdateNoteMutation
} = noteApi
