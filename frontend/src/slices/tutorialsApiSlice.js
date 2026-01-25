import { apiSlice } from './apiSlice';
import { TUTORIALS_URL } from '../constants';

export const tutorialsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTutorials: builder.query({
      query: () => ({
        url: TUTORIALS_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    createTutorial: builder.mutation({
      query: (data) => ({
        url: TUTORIALS_URL,
        method: 'POST',
        body: data,
      }),
    }),
    updateTutorial: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${TUTORIALS_URL}/${id}`,
        method: 'PUT',
        body,
      }),
    }),
    deleteTutorial: builder.mutation({
      query: (id) => ({
        url: `${TUTORIALS_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetTutorialsQuery,
  useCreateTutorialMutation,
  useUpdateTutorialMutation,
  useDeleteTutorialMutation,
} = tutorialsApiSlice;
