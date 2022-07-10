import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { iBoard } from "../../utils/models";


interface BoardState {
	boards: Record<string, iBoard>;
	current?: iBoard;
}

const initialState: BoardState = { boards: {} };

const boardSlice = createSlice({
	name: "boards",
	initialState: initialState,
	reducers: {
		setCurrentBoard: (state, action: PayloadAction<iBoard>) => {
			state.current = action.payload;
		},

		addBoard: (state, action: PayloadAction<iBoard>) => {
			state.boards[action.payload.id] = action.payload;
		},

		deleteBoard: (state, action: PayloadAction<string>) => {
			delete state.boards[action.payload];
		},
	},
});

export const { addBoard, deleteBoard, setCurrentBoard } = boardSlice.actions;
export default boardSlice;
