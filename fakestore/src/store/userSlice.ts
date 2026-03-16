import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    name: string;
    role: string;
    initials: string;
    status: string;
}

const initialState: UserState = {
    name: 'Rai Nouman',
    role: 'Administrator',
    initials: 'NA',
    status: 'online',
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateProfile: (state, action: PayloadAction<Partial<UserState>>) => {
            return { ...state, ...action.payload };
        },
    },
});

export const { updateProfile } = userSlice.actions;
export default userSlice.reducer;
