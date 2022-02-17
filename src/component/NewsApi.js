import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const NewsHeaders = {
  'x-bingapis-sdk': 'true',
  'x-rapidapi-host': 'bing-news-search1.p.rapidapi.com',
  'x-rapidapi-key': '6193fbc9a3msh7ad510c6275544dp1e0ed1jsn3e2533bac93d'
};
const baseUrl='https://bing-news-search1.p.rapidapi.com';
const createRequest = (url) => ({ url, headers: NewsHeaders });

export const NewsApi = createApi({
  reducerPath: 'NewsApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getNews: builder.query({
      query: ({ newsCategory, count }) => createRequest(`/news/search?q=${newsCategory}&safeSearch=Off&textFormat=Raw&freshness=Day&count=${count}`),
    }),
  }),
});

export const { useGetNewsQuery } = NewsApi;
