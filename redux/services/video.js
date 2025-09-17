import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const videoApi = createApi({
    reducerPath: 'videoApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BASE_API_URL}/video`,
    }),
    tagTypes: ['Video'], // ✅ define tag group
    endpoints: (builder) => ({
        getVideos: builder.query({
            query: () => '/all',
            providesTags: ['Video'], // ✅ this query provides the tag
        }),
        getVideoById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'Video', id }],
        }),
        createVideo: builder.mutation({
            query: (chapter) => ({
                url: '/create',
                method: 'POST',
                body: chapter,
            }),
            invalidatesTags: ['Video'], // ✅ revalidate after add
        }),
        deleteVideo: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Video'], // ✅ revalidate after delete
        }),
        updateVideo: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/update/${id}`,
                method: 'PATCH',
                body: {
                    updates: patch,
                },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Video', id },
                'Video',
            ], // ✅ revalidate this category + the list
        }),
    }),
})

export const {
    useCreateVideoMutation,
    useDeleteVideoMutation,
    useGetVideoByIdQuery,
    useGetVideosQuery,
    useUpdateVideoMutation,
} = videoApi
