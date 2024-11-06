import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    search: '',
};

export const counterSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        searchProduct: (state, action) => {
            state.search = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { searchProduct } = counterSlice.actions;

export default counterSlice.reducer;
