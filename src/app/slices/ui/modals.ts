import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { iCard } from "../../../utils/models";


interface EditCardModalState {
	target?: iCard;
}

interface UserLoginModalState {}

interface UserSignUpModalState {}

type ModalState = EditCardModalState &
	UserLoginModalState &
	UserSignUpModalState & {
		open: boolean;
	};

type ModalTypes = "editCard" | "login" | "signup";

const initialState: Record<ModalTypes, ModalState> = {
	editCard: {
		open: false,
	},
	login: {
		open: false,
	},
	signup: {
		open: false,
	},
};

const modalSlice = createSlice({
	name: "modals",
	initialState,
	reducers: {
		openModal: (state, action: PayloadAction<ModalTypes>) => {
			state[action.payload].open = true;
		},

		closeModal: (state, action: PayloadAction<ModalTypes>) => {
			state[action.payload].open = false;
		},

		setEditCardTarget: (state, action: PayloadAction<iCard>) => {
			state.editCard.target = action.payload;
		},
	},
});

export const { openModal, closeModal, setEditCardTarget } = modalSlice.actions;
export default modalSlice;
