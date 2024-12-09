
import { createSlice } from "@reduxjs/toolkit";
type initialStateProp = {
    id?: number,
    role?: number,
    user_email?: string
}
const initialState: initialStateProp = {

};
export const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        logoutUser: (state) => {

            return {};
        },
        logUser: (state, action) => {
            return { ...state, ...action.payload };
        },
    },
});
export const { logoutUser, logUser } = userSlice.actions;
export default userSlice.reducer;

