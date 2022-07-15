import { useEffect } from "react";
import { Outlet, Route, Routes } from "react-router-dom";

import { Box } from "@chakra-ui/react";

import { useGetUserBoardsQuery } from "../../../app/services/boards";
import { setCurrentBoard } from "../../../app/slices/board";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { MOCK_USER_ID } from "../../../utils/mockData";
import { BoardPage } from "../../board/ui/BoardPage";
import { SettingsPage } from "../../settings/SettingsPage";
import { MainDrawer } from "./components/MainDrawer";
import { MainNav } from "./components/MainNav";


export const MainView: React.FC = () => {
	const dispatch = useAppDispatch();
	const { data: boards } = useGetUserBoardsQuery(MOCK_USER_ID);
	const currentBoard = useAppSelector(state => state.boards.current);

	useEffect(() => {
		if (!boards) return;
		dispatch(setCurrentBoard(boards[0]));
	}, [boards]);

	return (
		<Box>
			<MainNav />
			<MainDrawer />
			<Outlet />
		</Box>
	);
};
