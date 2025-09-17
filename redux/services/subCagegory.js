import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const subCategoryApi = createApi({
    reducerPath: 'subCategoryApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BASE_API_URL}/subcategory`,
    }),
    tagTypes: ['SubCategory'], // ✅ define tag group
    endpoints: (builder) => ({
        getSubCategories: builder.query({
            query: () => '/all',
            providesTags: ['SubCategory'], // ✅ this query provides the tag
        }),
        getSubCategoryById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'SubCategory', id }],
        }),
        createSubCategory: builder.mutation({
            query: (newCategory) => ({
                url: '/create',
                method: 'POST',
                body: newCategory,
            }),
            invalidatesTags: ['SubCategory'], // ✅ revalidate after add
        }),
        deleteSubCategory: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['SubCategory'], // ✅ revalidate after delete
        }),
        updateSubCategory: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/update/${id}`,
                method: 'PATCH',
                body: {
                    updates: patch,
                },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'SubCategory', id },
                'SubCategory',
            ], // ✅ revalidate this category + the list
        }),
    }),
})

export const {
    useGetSubCategoriesQuery,
    useGetSubCategoryByIdQuery,
    useCreateSubCategoryMutation,
    useDeleteSubCategoryMutation,
    useUpdateSubCategoryMutation,
} = subCategoryApi
