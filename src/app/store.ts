import { combineReducers, configureStore } from "@reduxjs/toolkit";

import api from "./services/api";
import authSlice from "./slices/auth";
import boardSlice from "./slices/board";
import drawerSlice from "./slices/ui/drawers";
import modalSlice from "./slices/ui/modals";
import snackSlice from "./slices/ui/snack";


const uiReducer = combineReducers({
	[modalSlice.name]: modalSlice.reducer,
	[snackSlice.name]: snackSlice.reducer,
	[drawerSlice.name]: drawerSlice.reducer,
});

const rootReducer = combineReducers({
	[api.reducerPath]: api.reducer,
	ui: uiReducer,
	[boardSlice.name]: boardSlice.reducer,
	[authSlice.name]: authSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
	reducer: rootReducer,
	middleware: gDM => gDM().concat(api.middleware),
});

export type Store = typeof store;
export type AppDispatch = typeof store.dispatch;
export default store;