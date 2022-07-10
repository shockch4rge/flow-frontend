import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { iCard, iComponent } from "../../utils/models";


const cardSlice = createSlice({
	name: "cards",
	initialState: {} as Record<string, iCard>,
	reducers: {
		addCard: (state, action: PayloadAction<iCard>) => {
			state[action.payload.id] = action.payload;
		},

		deleteCard: (state, action: PayloadAction<string>) => {
			delete state[action.payload];
		},
	},
});

export const { addCard, deleteCard } = cardSlice.actions;
export default cardSlice;
