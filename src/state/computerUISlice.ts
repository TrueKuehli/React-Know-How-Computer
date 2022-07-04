import { createSlice } from "@reduxjs/toolkit"


export const computerUISlice = createSlice({
    name: "computerUI",
    initialState: {
        selectedCommand: 0,
    },
    reducers: {
        setSelectedCommand: (state, action) => {
            state.selectedCommand = action.payload;
        },
    },
})

// Action creators are generated for each case reducer function
export const { setSelectedCommand } = computerUISlice.actions

export default computerUISlice.reducer
