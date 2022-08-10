// import "./assets/styles/index.css";

import { useCallback, useEffect, useState } from "react";
import { Route, Routes, useRoutes } from "react-router-dom";

import { Box, Center, Heading, Spinner, Text, VStack, Wrap } from "@chakra-ui/react";

import { useGetUserBoardsQuery, useLazyGetUserBoardsQuery } from "./app/services/boards";
import { setCurrentBoard } from "./app/slices/board";
import { Toast } from "./common-components/Toast";
import { BoardPage } from "./features/board/ui/BoardPage";
import { LandingPage } from "./features/landing/ui/LandingPage";
import { MainView } from "./features/main/ui/MainView";
import { SettingsPage } from "./features/settings/ui/SettingsPage";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { useAppSelector } from "./hooks/useAppSelector";
import { MOCK_USER_ID } from "./utils/mockData";

const App: React.FC = () => {
	const dispatch = useAppDispatch();
	const [pollingInterval, setPollingInterval] = useState(0);
	const currentBoard = useAppSelector(state => state.boards.current);
	const {
		data: boards,
		isLoading: isLoadingBoards,
		isSuccess: hasFetchedBoards,
	} = useGetUserBoardsQuery(MOCK_USER_ID);

	useEffect(() => {
		if (!isLoadingBoards || hasFetchedBoards) return;
		setTimeout(() => setPollingInterval(v => v + 10000), 10000);
	}, [isLoadingBoards, hasFetchedBoards]);

	useEffect(() => {
		if (!boards) return;
		dispatch(setCurrentBoard(boards[+localStorage.getItem("lastEditedBoard")! ?? 0]));
	}, [boards]);

	useEffect(() => {
		if (!currentBoard) return;
		document.title = `${currentBoard.name} | Flow`;
	}, [currentBoard]);

	return (
		<>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/home" element={<MainView />}>
					<Route
						path="board"
						element={
							currentBoard ? (
								<BoardPage board={currentBoard} />
							) : (
								<Center w="full">
									<VStack>
										<Spinner />
										<Heading>Loading your boards...</Heading>
										{pollingInterval > 0 && (
											<Text>
												We're having trouble at the moment. Refetching in{" "}
												{pollingInterval / 1000} seconds.
											</Text>
										)}
									</VStack>
								</Center>
							)
						}
					/>
					<Route path="settings" element={<SettingsPage />} />
				</Route>
			</Routes>
			<Toast />
		</>
	);
};

export default App;
