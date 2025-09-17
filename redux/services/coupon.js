import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const couponApi = createApi({
    reducerPath: 'couponApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BASE_API_URL}/coupon`,
    }),
    tagTypes: ['Coupon'], // ✅ define tag group
    endpoints: (builder) => ({
        getCoupons: builder.query({
            query: () => '/all',
            providesTags: ['Coupon'], // ✅ this query provides the tag
        }),

        createCoupon: builder.mutation({
            query: (book) => ({
                url: '/create',
                method: 'POST',
                body: book,
            }),
            invalidatesTags: ['Coupon'], // ✅ revalidate after add
        }),
        deleteCoupon: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Coupon'], // ✅ revalidate after delete
        }),
        updateCoupon: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/update/${id}`,
                method: 'PATCH',
                body: {
                    updates: patch,
                },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Coupon', id },
                'Coupon',
            ], // ✅ revalidate this category + the list
        }),
    }),
})

export const {
    useGetCouponsQuery,
    useCreateCouponMutation,
    useDeleteCouponMutation,
    useUpdateCouponMutation,
    
} = couponApi
