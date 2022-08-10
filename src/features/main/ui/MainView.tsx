import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { Box, HStack } from "@chakra-ui/react";

import { useGetUserBoardsQuery } from "../../../app/services/boards";
import { setCurrentBoard } from "../../../app/slices/board";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { MOCK_USER_ID } from "../../../utils/mockData";
import { MainSidebar } from "./components/MainSidebar";


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
			<HStack h="100vh" overflow="hidden" spacing="0">
				<MainSidebar boards={boards}/>
				<Outlet />
			</HStack>
		</Box>
	);
};
