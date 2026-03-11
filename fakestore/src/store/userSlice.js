import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    name: 'Rai Nouman',
    role: 'Administrator',
    initials: 'NA',
    status: 'online',
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateProfile: (state, action) => {
            return { ...state, ...action.payload };
        },
    },
});

export const { updateProfile } = userSlice.actions;
export default userSlice.reducer;
