import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const categoryApi = createApi({
    reducerPath: 'categoryApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BASE_API_URL}/category`,
    }),
    tagTypes: ['Category'], // ✅ define tag group
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => '/all',
            providesTags: ['Category'], // ✅ this query provides the tag
            
        }),
        getCategoryById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'Category', id }],
        }),
        createCategory: builder.mutation({
            query: (newCategory) => ({
                url: '/create',
                method: 'POST',
                body: newCategory,
            }),
            invalidatesTags: ['Category'], // ✅ revalidate after add
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Category'], // ✅ revalidate after delete
        }),
        updateCategory: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/update/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Category', id },
                'Category',
            ], // ✅ revalidate this category + the list
        }),
    }),
})

export const {
    useGetCategoriesQuery,
    useGetCategoryByIdQuery,
    useCreateCategoryMutation,
    useDeleteCategoryMutation,
    useUpdateCategoryMutation,
} = categoryApi
