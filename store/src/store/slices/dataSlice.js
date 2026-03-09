import { createSlice } from '@reduxjs/toolkit';

const dataSlice = createSlice({
    name: 'data',
    initialState: {
        myProducts: [],
        productOverrides: {},
        deletedProductIds: [],
        myCategories: [],
        categoryOverrides: {},
        deletedCategoryIds: [],
        nextLocalCategoryId: 3000000,
        myUsers: [],
        deletedUserIds: [],
        nextLocalUserId: 5000000,
    },
    reducers: {
        setMyProducts: (state, action) => {
            state.myProducts = action.payload;
        },
        setProductOverrides: (state, action) => {
            state.productOverrides = action.payload;
        },
        setDeletedProductIds: (state, action) => {
            state.deletedProductIds = action.payload;
        },
        setMyCategories: (state, action) => {
            state.myCategories = action.payload;
        },
        setCategoryOverrides: (state, action) => {
            state.categoryOverrides = action.payload;
        },
        setDeletedCategoryIds: (state, action) => {
            state.deletedCategoryIds = action.payload;
        },
        setNextLocalCategoryId: (state, action) => {
            state.nextLocalCategoryId = action.payload;
        },
        setMyUsers: (state, action) => {
            state.myUsers = action.payload;
        },
        setDeletedUserIds: (state, action) => {
            state.deletedUserIds = action.payload;
        },
        setNextLocalUserId: (state, action) => {
            state.nextLocalUserId = action.payload;
        },
    },
});

export const {
    setMyProducts,
    setProductOverrides,
    setDeletedProductIds,
    setMyCategories,
    setCategoryOverrides,
    setDeletedCategoryIds,
    setNextLocalCategoryId,
    setMyUsers,
    setDeletedUserIds,
    setNextLocalUserId,
} = dataSlice.actions;

export default dataSlice.reducer;
