import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const mediaApi = createApi({
    reducerPath: 'mediaApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BASE_API_URL}/media`,
    }),
    tagTypes: ['Media'], // ✅ define tag group
    endpoints: (builder) => ({
        getMedias: builder.query({
            query: () => '/all',
            providesTags: ['Media'], // ✅ this query provides the tag
        }),

        createMedia: builder.mutation({
            query: (subject) => ({
                url: '/create',
                method: 'POST',
                body: subject,
            }),
            invalidatesTags: ['Media'], // ✅ revalidate after add
        }),
        deleteMedia: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Media'], // ✅ revalidate after delete
        }),
        updateMedia: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/update/${id}`,
                method: 'PATCH',
                body: {
                    updates: patch,
                },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Media', id },
                'Media',
            ], // ✅ revalidate this category + the list
        }),
    }),
})

export const {
 useCreateMediaMutation,
 useDeleteMediaMutation,
 useGetMediasQuery,
 useUpdateMediaMutation
} = mediaApi
