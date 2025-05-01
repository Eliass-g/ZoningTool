import { configureStore } from '@reduxjs/toolkit';
import zoningReducer from './features/zoning/zoningSlice';

export const store = configureStore({
  reducer: {
    zoning: zoningReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["zoning/getParcels"],
        ignoredPaths: ["zoning.parcels"],
      },
    }),
});