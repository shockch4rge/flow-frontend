import { createSlice } from "@reduxjs/toolkit";
import { iUser } from "../../utils/models";
import authService from "../services/auth";

type AuthState = {
	token: string | null;
	user: iUser | null;
};

const initialState: AuthState = {
	token: localStorage.getItem("token") ?? null,
	user: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addMatcher(authService.endpoints.loginUser.matchFulfilled, (state, { payload }) => {
				localStorage.setItem("token", payload.authorization.token);
				state.token = localStorage.getItem("token")!;
				state.user = payload.user;
			})
			.addMatcher(authService.endpoints.createUser.matchFulfilled, (state, { payload }) => {
				localStorage.setItem("token", payload.authorization.token);
				state.token = localStorage.getItem("token")!;
				state.user = payload.user;
			})
			.addMatcher(
				authService.endpoints.getCurrentUser.matchFulfilled,
				(state, { payload }) => {
					state.user = payload.user;
				}
			)
			.addMatcher(authService.endpoints.signOutUser.matchFulfilled, state => {
				localStorage.removeItem("token");
				state.token = null;
				state.user = null;
			})
			.addMatcher(authService.endpoints.deleteUser.matchFulfilled, state => {
				localStorage.removeItem("token");
				state.token = null;
				state.user = null;
			})
			.addMatcher(authService.endpoints.refreshAuth.matchFulfilled, (state, { payload }) => {
				localStorage.setItem("token", payload.authorization.token);
				state.token = localStorage.getItem("token")!;
				state.user = payload.user;
			});
	},
});

export default authSlice;
