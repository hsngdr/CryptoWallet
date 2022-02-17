import { configureStore } from '@reduxjs/toolkit';

import { CryptoStats } from './component/CryptoStats';
import { NewsApi } from './component/NewsApi';

export default configureStore({
  reducer: {
    [CryptoStats.reducerPath]: CryptoStats.reducer,
    [NewsApi.reducerPath]: NewsApi.reducer

  },
});