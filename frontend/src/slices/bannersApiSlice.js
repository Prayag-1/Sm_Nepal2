import { apiSlice } from './apiSlice';
import { BANNERS_URL } from '../constants';

export const bannersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBanners: builder.query({
      query: () => ({
        url: BANNERS_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    createBanner: builder.mutation({
      query: (data) => ({
        url: BANNERS_URL,
        method: 'POST',
        body: data,
      }),
    }),
    updateBanner: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${BANNERS_URL}/${id}`,
        method: 'PUT',
        body,
      }),
    }),
    deleteBanner: builder.mutation({
      query: (id) => ({
        url: `${BANNERS_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannersApiSlice;
