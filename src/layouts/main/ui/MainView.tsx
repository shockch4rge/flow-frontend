import { useEffect } from "react";
import { Outlet, useOutletContext } from "react-router-dom";

import { Box, HStack } from "@chakra-ui/react";

import { useGetUserBoardsQuery } from "../../../app/services/boards";
import { setCurrentBoard } from "../../../app/slices/board";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { MOCK_USER_ID } from "../../../utils/mockData";
import { MainSidebar } from "./components/MainSidebar";
import { iBoard } from "../../../utils/models";
import { AddBoardModal } from "./components/AddBoardModal";

export const MainView: React.FC = () => {
	const dispatch = useAppDispatch();
	const currentBoard = useAppSelector(state => state.boards.current);

	const {
		data: boards,
		isLoading: isLoadingBoards,
		isSuccess: hasFetchedBoards,
	} = useGetUserBoardsQuery(MOCK_USER_ID);

	useEffect(() => {
		if (!boards) return;
		dispatch(setCurrentBoard(boards[+localStorage.getItem("lastEditedBoard")! ?? 0]));
	}, [boards]);

	useEffect(() => {
		if (!currentBoard) return;
		document.title = `${currentBoard.name} | Flow`;
	}, [currentBoard]);

	return (
		<Box>
			<HStack h="100vh" overflow="hidden" spacing="0">
				<MainSidebar boards={boards} />
				{currentBoard && <Outlet context={{ currentBoard, isLoadingBoards }} />}
			</HStack>
			<AddBoardModal />
		</Box>
	);
};

export const useBoards = () => {
	return useOutletContext<{ currentBoard: iBoard; isLoadingBoards: boolean }>();
};
