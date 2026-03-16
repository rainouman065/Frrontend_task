import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
    activeTab: string;
    sidebarOpen: boolean;
}

const initialState: UiState = {
    activeTab: 'Books',
    sidebarOpen: false,
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setActiveTab: (state, action: PayloadAction<string>) => {
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
