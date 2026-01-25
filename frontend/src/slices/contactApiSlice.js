import { apiSlice } from './apiSlice';
import { CONTACT_URL, SETTINGS_URL } from '../constants';

export const contactApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    submitContact: builder.mutation({
      query: (data) => ({
        url: CONTACT_URL,
        method: 'POST',
        body: data,
      }),
    }),
    getQueries: builder.query({
      query: () => ({
        url: `${CONTACT_URL}/queries`,
      }),
      keepUnusedDataFor: 5,
    }),
    markQueryRead: builder.mutation({
      query: (id) => ({
        url: `${CONTACT_URL}/queries/${id}/read`,
        method: 'PUT',
      }),
    }),
    getSettings: builder.query({
      query: () => ({
        url: SETTINGS_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    updateSettings: builder.mutation({
      query: (data) => ({
        url: SETTINGS_URL,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const {
  useSubmitContactMutation,
  useGetQueriesQuery,
  useMarkQueryReadMutation,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} = contactApiSlice;
