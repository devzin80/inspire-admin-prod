import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const bookApi = createApi({
    reducerPath: 'bookApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BASE_API_URL}/book`,
    }),
    tagTypes: ['Book'], // ✅ define tag group
    endpoints: (builder) => ({
        getBooks: builder.query({
            query: () => '/all',
            providesTags: ['Book'], // ✅ this query provides the tag
        }),
        getBookById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'Book', id }],
        }),
        createBook: builder.mutation({
            query: (book) => ({
                url: '/create',
                method: 'POST',
                body: book,
            }),
            invalidatesTags: ['Book'], // ✅ revalidate after add
        }),
        deleteBook: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Book'], // ✅ revalidate after delete
        }),
        updateBook: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/update/${id}`,
                method: 'PATCH',
                body: {
                    updates: patch,
                },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Book', id },
                'Book',
            ], // ✅ revalidate this category + the list
        }),
    }),
})

export const {
    useGetBooksQuery,
    useGetBookByIdQuery,
    useCreateBookMutation,
    useDeleteBookMutation,
    useUpdateBookMutation,
} = bookApi
