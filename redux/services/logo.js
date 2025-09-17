import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const logoApi = createApi({
    reducerPath: 'logoApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BASE_API_URL}/logo`,
    }),
    tagTypes: ['Logo'], // ✅ define tag group
    endpoints: (builder) => ({
        getLogo: builder.query({
            query: () => '/all',
            providesTags: ['Logo'], // ✅ this query provides the tag
        }),

        createLogo: builder.mutation({
            query: (logo) => ({
                url: '/create',
                method: 'POST',
                body: logo,
            }),
            invalidatesTags: ['Logo'], // ✅ revalidate after add
        }),

        updateLogo: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/update/${id}`,
                method: 'PATCH',
                body: {
                    updates: patch,
                },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Logo', id },
                'Logo',
            ], // ✅ revalidate this category + the list
        }),
    }),
})

export const {
   useGetLogoQuery,
   useCreateLogoMutation,
   useUpdateLogoMutation
} = logoApi
