import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { iFolder } from "../../utils/models";


const folderSlice = createSlice({
	name: "folders",
	initialState: {} as Record<string, iFolder>,
	reducers: {
		addFolder: (state, action: PayloadAction<iFolder>) => {
			state[action.payload.id] = action.payload;
		},

		deleteFolder: (state, action: PayloadAction<string>) => {
			delete state[action.payload];
		},
	},
});

export const { addFolder, deleteFolder } = folderSlice.actions;
export default folderSlice;
