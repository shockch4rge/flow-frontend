import { ToastProps } from "@chakra-ui/react";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface ToastState {
	content: string;
	severity: ToastProps["status"];
	duration: number;
	position: ToastProps["position"];
	open: boolean;
}

const initialState: ToastState = {
	content: "",
	severity: "success",
	position: "bottom",
	duration: 4000,
	open: false,
};

const toastSlice = createSlice({
	name: "snack",
	initialState,
	reducers: {
		toast: (_, action: PayloadAction<Partial<Omit<ToastState, "open">>>) => {
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
		closeToast: state => {
			return {
				...state,
				open: false,
			};
		},
	},
});

export const { toast, closeToast } = toastSlice.actions;
export default toastSlice;
