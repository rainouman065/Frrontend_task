import { createSlice } from '@reduxjs/toolkit';
import { clearTokens, } from '../../api';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: true, // App start pe true rakhenge takay ProtectedRoute profile fetch ka wait kare
        error: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.loading = false;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        logout: (state) => {
            clearTokens();
            state.user = null;
            state.loading = false;
        },
    },
});

export const { setUser, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;
