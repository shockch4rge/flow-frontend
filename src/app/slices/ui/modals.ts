import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { iCard, iFolder } from "../../../utils/models";
import cardService from "../../services/cards";

interface BaseModalState {
    open: boolean;
}

interface EditCardModalState extends BaseModalState {
    target?: iCard;
}

interface EditFolderModalState extends BaseModalState {
    target?: iFolder;
}

interface EditBoardModalState extends BaseModalState {}

interface AddBoardModalState extends BaseModalState {}

interface UserLoginModalState extends BaseModalState {}

interface UserSignUpModalState extends BaseModalState {}

interface ResetPasswordModalState extends BaseModalState {}

type ModalTypes =
    | "editCard"
    | "editFolder"
    | "editBoard"
    | "addBoard"
    | "login"
    | "signup"
    | "resetPassword";

const initialState = {
    editCard: {
        open: false,
    } as EditCardModalState,
    login: {
        open: false,
    } as UserLoginModalState,
    signup: {
        open: false,
    } as UserSignUpModalState,
    resetPassword: {
        open: false,
    } as ResetPasswordModalState,
    editFolder: {
        open: false,
    } as EditFolderModalState,
    editBoard: {
        open: false,
    } as EditBoardModalState,
    addBoard: {
        open: false,
    } as AddBoardModalState,
};

const modalSlice = createSlice({
    name: "modals",
    initialState,
    reducers: {
        // TODO: why can't ts infer initialState types???
        openModal: (state: any, action: PayloadAction<ModalTypes>) => {
            state[action.payload].open = true;
        },

        closeModal: (state: any, action: PayloadAction<ModalTypes>) => {
            state[action.payload].open = false;
        },

        setEditCardTarget: (state: any, action: PayloadAction<iCard>) => {
            state.editCard.target = action.payload;
        },

        setEditFolderTarget: (state: any, action: PayloadAction<iFolder>) => {
            state.editFolder.target = action.payload;
        },
    },

    extraReducers: builder => {
        builder.addMatcher(
            cardService.endpoints.getFolderCards.matchFulfilled,
            (state, { payload: cards }) => {
                const currentCard = state.editCard.target;
                // if there is no current card target, we don't need to do anything
                if (!currentCard) return;

                const currentCardUpdate = cards.find(card => card.id === currentCard.id);

                if (!currentCardUpdate) return;

                state.editCard.target = currentCardUpdate;
            }
        );
    },
});

export const { openModal, closeModal, setEditCardTarget, setEditFolderTarget } = modalSlice.actions;
export default modalSlice;
