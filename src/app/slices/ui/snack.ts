import { ToastProps } from "@chakra-ui/react";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface SnackState {
	content: string;
	severity: ToastProps["status"];
	duration: number;
	position: ToastProps["position"];
	open: boolean;
}

const initialState: SnackState = {
	content: "",
	severity: "success",
	position: "bottom",
	duration: 4000,
	open: false,
};

const snackSlice = createSlice({
	name: "snack",
	initialState,
	reducers: {
		createSnack: (_, action: PayloadAction<Partial<Omit<SnackState, "open">>>) => {
			const { content, severity, position, duration } = action.payload;

			return {
				content: content ?? "",
				severity: severity ?? "success",
				duration: duration ?? 4000,
				position: position ?? "bottom",
				open: true,
			};
		},

		// only exists to update dependencies in useEffect. No need to use this manually
		closeSnack: state => {
			return {
				...state,
				open: false,
			};
		},
	},
});

export const { createSnack, closeSnack } = snackSlice.actions;
export default snackSlice;
