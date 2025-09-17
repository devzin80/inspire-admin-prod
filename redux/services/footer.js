import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const footerApi = createApi({
    reducerPath: 'footerApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BASE_API_URL}/footer`,
    }),
    tagTypes: ['Footer'], // ✅ define tag group
    endpoints: (builder) => ({
        getFooters: builder.query({
            query: () => '/all',
            providesTags: ['Footer'], // ✅ this query provides the tag
        }),

        createFooter: builder.mutation({
            query: (footer) => ({
                url: '/create',
                method: 'POST',
                body: footer,
            }),
            invalidatesTags: ['Footer'], // ✅ revalidate after add
        }),

        updateFooter: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/update/${id}`,
                method: 'PATCH',
                body: {
                    updates: patch,
                },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Footer', id },
                'Footer',
            ], // ✅ revalidate this category + the list
        }),
    }),
})

export const {
    useGetFootersQuery,
    useCreateFooterMutation,
    useUpdateFooterMutation
} = footerApi
