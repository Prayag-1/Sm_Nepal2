import { apiSlice } from './apiSlice';
import { BRANDS_URL } from '../constants';

export const brandsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query({
      query: () => ({
        url: BRANDS_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    createBrand: builder.mutation({
      query: (data) => ({
        url: BRANDS_URL,
        method: 'POST',
        body: data,
      }),
    }),
    updateBrand: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${BRANDS_URL}/${id}`,
        method: 'PUT',
        body,
      }),
    }),
    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `${BRANDS_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandsApiSlice;
