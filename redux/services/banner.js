import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const bannerApi = createApi({
    reducerPath: 'bannerApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BASE_API_URL}/banner`,
    }),
    tagTypes: ['Banner'], // ✅ define tag group
    endpoints: (builder) => ({
        getBanners: builder.query({
            query: () => '/all',
            providesTags: ['Banner'], // ✅ this query provides the tag
        }),

        createBanner: builder.mutation({
            query: (subject) => ({
                url: '/create',
                method: 'POST',
                body: subject,
            }),
            invalidatesTags: ['Banner'], // ✅ revalidate after add
        }),
        deleteBanner: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Banner'], // ✅ revalidate after delete
        }),
        updateBanner: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/update/${id}`,
                method: 'PATCH',
                body: {
                    updates: patch,
                },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Banner', id },
                'Banner',
            ], // ✅ revalidate this category + the list
        }),
    }),
})

export const {
    useCreateBannerMutation,
    useGetBannersQuery,
    useDeleteBannerMutation,
    useUpdateBannerMutation,
} = bannerApi
