import { configureStore } from "@reduxjs/toolkit"
import computerSliceReducer from "./computerSlice"
import computerUISliceReducer from "./computerUISlice"

const store = configureStore({
    reducer: {
        computer: computerSliceReducer,
        computerUI: computerUISliceReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;