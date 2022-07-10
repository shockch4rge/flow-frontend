import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { iUser } from "../../utils/models";


interface AuthState {
	currentUser: iUser | null;
}

const initialState: AuthState = {
	currentUser: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState: initialState,
	reducers: {
		loginUser: (state, action: PayloadAction<iUser | null>) => {
			state.currentUser = action.payload;
		},
	},
});

export const { loginUser } = authSlice.actions;
export default authSlice;
