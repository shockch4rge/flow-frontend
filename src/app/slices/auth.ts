import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { iUser } from "../../utils/models";
import { auth } from "../services/auth";

type AuthState = {
	token: string | null;
	user: iUser | null;
};

const initialState: AuthState = {
	token: null,
	user: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {},
	extraReducers: ({ addMatcher }) => {
		addMatcher(auth.endpoints.loginUser.matchFulfilled, (state, { payload }) => {
			state.token = payload.authorization.token;
			state.user = payload.user;
		});
	},
});

export default authSlice;
