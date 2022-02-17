import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const cryptoStatsHeaders = {
  'x-rapidapi-host': 'coinpaprika1.p.rapidapi.com',
  'x-rapidapi-key': '6193fbc9a3msh7ad510c6275544dp1e0ed1jsn3e2533bac93d'
};
const baseUrl='https://coinpaprika1.p.rapidapi.com';

const createRequest = (url) => ({ url, headers: cryptoStatsHeaders });

export const CryptoStats = createApi({
  reducerPath: 'CryptoStats',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({ 
    getCryptos: builder.query({
      query: () => createRequest(`/global`),
    })
  })
});

export const { useGetCryptosQuery } = CryptoStats;
