import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const aboutApi = createApi({
    reducerPath: 'aboutApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BASE_API_URL}/about`,
    }),
    tagTypes: ['About'], // ✅ define tag group
    endpoints: (builder) => ({
        getAbout: builder.query({
            query: () => '/all',
            providesTags: ['About'], // ✅ this query provides the tag
        }),

        createAbout: builder.mutation({
            query: (footer) => ({
                url: '/create',
                method: 'POST',
                body: footer,
            }),
            invalidatesTags: ['About'], // ✅ revalidate after add
        }),

        updateAbout: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/update/${id}`,
                method: 'PATCH',
                body: {
                    updates: patch,
                },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'About', id },
                'About',
            ], // ✅ revalidate this category + the list
        }),
    }),
})

export const {
    useCreateAboutMutation,
    useGetAboutQuery,
    useUpdateAboutMutation,
} = aboutApi
