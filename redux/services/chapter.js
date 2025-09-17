import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const chapterApi = createApi({
    reducerPath: 'chapterApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BASE_API_URL}/chapter`,
    }),
    tagTypes: ['Chapter'], // ✅ define tag group
    endpoints: (builder) => ({
        getChapters: builder.query({
            query: () => '/all',
            providesTags: ['Chapter'], // ✅ this query provides the tag
        }),
        getChapterById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'Chapter', id }],
        }),
        createChapter: builder.mutation({
            query: (chapter) => ({
                url: '/create',
                method: 'POST',
                body: chapter,
            }),
            invalidatesTags: ['Chapter'], // ✅ revalidate after add
        }),
        deleteChapter: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Chapter'], // ✅ revalidate after delete
        }),
        updateChapter: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/update/${id}`,
                method: 'PATCH',
                body: {
                    updates: patch,
                },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Chapter', id },
                'Chapter',
            ], // ✅ revalidate this category + the list
        }),
    }),
})

export const {
    useGetChaptersQuery,
    useGetChapterByIdQuery,
    useCreateChapterMutation,
    useDeleteChapterMutation,
    useUpdateChapterMutation
    
} = chapterApi
