import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { iBoard } from "../../utils/models";
import boardService from "../services/boards";

interface BoardState {
	index: number;
	current: iBoard | null;
}

const initialState: BoardState = {
	index: Number(localStorage.getItem("currentBoardIndex") ?? 0),
	current: null,
};

const boardSlice = createSlice({
	name: "boards",
	initialState: initialState,
	reducers: {
		setCurrentBoard: (state: any, action: PayloadAction<iBoard>) => {
			state.current = action.payload;
		},
	},

	extraReducers: builder => {
		builder.addMatcher(
			boardService.endpoints.getUserBoards.matchFulfilled,
			(state, { payload }) => {
				state.current = payload[state.index];
			}
		);
	},
});

export const { setCurrentBoard } = boardSlice.actions;
export default boardSlice;
