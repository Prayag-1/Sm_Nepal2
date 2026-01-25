import { apiSlice } from './apiSlice';
import { CATEGORIES_URL } from '../constants';

export const categoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => ({
        url: CATEGORIES_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: CATEGORIES_URL,
        method: 'POST',
        body: data,
      }),
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${CATEGORIES_URL}/${id}`,
        method: 'PUT',
        body,
      }),
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `${CATEGORIES_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApiSlice;
