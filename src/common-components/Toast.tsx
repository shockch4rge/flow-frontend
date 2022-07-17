import { useEffect, useRef, useState } from "react";

import { useToast } from "@chakra-ui/react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

import { closeToast } from "../app/slices/ui/toast";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";


export const Toast: React.FC = () => {
	const toast = useToast();
	const dispatch = useAppDispatch();
	const { open, content, severity, duration, position } = useAppSelector(state => state.ui.snack);

	useEffect(() => {
		if (!open) return;

		toast({
			isClosable: true,
			// title: content,
			description: content,
			status: severity,
			position,
			duration,
		});

		return () => void dispatch(closeToast());
	}, [open]);

	return <></>;
};
