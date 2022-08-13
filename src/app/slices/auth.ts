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
	extraReducers: builder => {
		builder.addMatcher(auth.endpoints.loginUser.matchFulfilled, (state, action) => {
			console.log(action.payload.authorization);

			state.token = action.payload.authorization.token;
			state.user = action.payload.user;
		});
	},
});

export default authSlice;
