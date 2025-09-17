import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const topicApi = createApi({
    reducerPath: 'topicApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BASE_API_URL}/topic`,
    }),
    tagTypes: ['Topic'], // ✅ define tag group
    endpoints: (builder) => ({
        getTopics: builder.query({
            query: () => '/all',
            providesTags: ['Topic'], // ✅ this query provides the tag
        }),
        getTopicById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'Topic', id }],
        }),
        createTopic: builder.mutation({
            query: (chapter) => ({
                url: '/create',
                method: 'POST',
                body: chapter,
            }),
            invalidatesTags: ['Topic'], // ✅ revalidate after add
        }),
        deleteTopic: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Topic'], // ✅ revalidate after delete
        }),
        updateTopic: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/update/${id}`,
                method: 'PATCH',
                body: {
                    updates: patch,
                },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Topic', id },
                'Topic',
            ], // ✅ revalidate this category + the list
        }),
    }),
})

export const {
    useGetTopicsQuery,
    useGetTopicByIdQuery,
    useCreateTopicMutation,
    useUpdateTopicMutation,
    useDeleteTopicMutation
   
} = topicApi
