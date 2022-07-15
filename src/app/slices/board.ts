import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { iBoard } from "../../utils/models";


interface BoardState {
	current: iBoard | null;
}

const initialState: BoardState = {
	current: null,
};

const boardSlice = createSlice({
	name: "boards",
	initialState: initialState,
	reducers: {
		setCurrentBoard: (state, action: PayloadAction<iBoard>) => {
			state.current = action.payload;
		},
	},
});

export const { setCurrentBoard } = boardSlice.actions;
export default boardSlice;
