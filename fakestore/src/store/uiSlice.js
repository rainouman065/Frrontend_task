import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    activeTab: 'Books',
    sidebarOpen: false,
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        closeSidebar: (state) => {
            state.sidebarOpen = false;
        },
    },
});

export const { setActiveTab, toggleSidebar, closeSidebar } = uiSlice.actions;
export default uiSlice.reducer;
