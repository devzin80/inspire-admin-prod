import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const classApi = createApi({
    reducerPath: 'classApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BASE_API_URL}/class`,
    }),
    tagTypes: ['Class'], // ✅ define tag group
    endpoints: (builder) => ({
        getClasses: builder.query({
            query: () => '/all',
            providesTags: ['Class'], // ✅ this query provides the tag
        }),
        getClassById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'Class', id }],
        }),
        createClass: builder.mutation({
            query: (newClass) => ({
                url: '/create',
                method: 'POST',
                body: newClass,
            }),
            invalidatesTags: ['Class'], // ✅ revalidate after add
        }),
        deleteClass: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Class'], // ✅ revalidate after delete
        }),
        updateClass: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/update/${id}`,
                method: 'PATCH',
                body: {"updates": patch},
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Class', id },
                'Class',
            ], // ✅ revalidate this category + the list
        }),
    }),
})

export const {
    useGetClassesQuery,
    useGetClassByIdQuery,
    useCreateClassMutation,
    useDeleteClassMutation,
    useUpdateClassMutation,
} = classApi
