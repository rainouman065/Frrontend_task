import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dataReducer from './slices/dataSlice';

export const store = configureStore({
    reducer: {
         // authSlice ki state
        auth: authReducer,
         // DataSlice ki state
        data: dataReducer,
    },
});

export default store;
