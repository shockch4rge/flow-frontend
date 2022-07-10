import { useEffect, useRef, useState } from "react";

import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

import { closeSnack } from "../app/slices/ui/snack";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";


export const Snack: React.FC = () => {
	const dispatch = useAppDispatch();
	const { open, content, severity, duration, position } = useAppSelector(state => state.ui.snack);

	const handleOnClose = () => {
		dispatch(closeSnack());
	};

	return (
		<Snackbar open={open} anchorOrigin={position} autoHideDuration={duration} onClose={handleOnClose}>
			<Alert onClose={handleOnClose} severity={severity} sx={{ width: "100%" }}>
				{content}
			</Alert>
		</Snackbar>
	);
};
