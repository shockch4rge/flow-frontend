import { combineReducers, configureStore } from "@reduxjs/toolkit";

import api from "./services/api";
import boardSlice from "./slices/board";
import drawerSlice from "./slices/ui/drawers";
import modalSlice from "./slices/ui/modals";

const uiReducer = combineReducers({
	[modalSlice.name]: modalSlice.reducer,
	[drawerSlice.name]: drawerSlice.reducer,
});

const rootReducer = combineReducers({
	[api.reducerPath]: api.reducer,
	[boardSlice.name]: boardSlice.reducer,
	ui: uiReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
	reducer: rootReducer,
	middleware: gDM => gDM().concat(api.middleware),
});

export type Store = typeof store;
export type AppDispatch = typeof store.dispatch;
export default store;
