import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const promotionalBannerApi = createApi({
    reducerPath: 'promotionalBannerApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BASE_API_URL}/promotional-banner`,
    }),
    tagTypes: ['PromotionalBanner'], // ✅ define tag group
    endpoints: (builder) => ({
        getPromotionalBanners: builder.query({
            query: () => '/all',
            providesTags: ['PromotionalBanner'], // ✅ this query provides the tag
        }),

        createPromotionalBanner: builder.mutation({
            query: (subject) => ({
                url: '/create',
                method: 'POST',
                body: subject,
            }),
            invalidatesTags: ['PromotionalBanner'], // ✅ revalidate after add
        }),
        deletePromotionalBanner: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['PromotionalBanner'], // ✅ revalidate after delete
        }),
        updatePromotionalBanner: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/update/${id}`,
                method: 'PATCH',
                body: {
                    updates: patch,
                },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'PromotionalBanner', id },
                'PromotionalBanner',
            ], // ✅ revalidate this category + the list
        }),
    }),
})

export const {
    useCreatePromotionalBannerMutation,
    useDeletePromotionalBannerMutation,
    useGetPromotionalBannersQuery,
    useUpdatePromotionalBannerMutation
} = promotionalBannerApi
