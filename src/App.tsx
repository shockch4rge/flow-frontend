import "./assets/styles/index.css";

import { useCallback, useEffect } from "react";
import { Route, Routes, useRoutes } from "react-router-dom";

import { Center, Heading, Spinner, VStack, Wrap } from "@chakra-ui/react";

import { useGetUserBoardsQuery, useLazyGetUserBoardsQuery } from "./app/services/boards";
import { setCurrentBoard } from "./app/slices/board";
import { Toast } from "./components/Toast";
import { BoardPage } from "./features/board/ui/BoardPage";
import { LandingPage } from "./features/landing/ui/LandingPage";
import { MainView } from "./features/main/ui/MainView";
import { SettingsPage } from "./features/settings/SettingsPage";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { useAppSelector } from "./hooks/useAppSelector";


const App: React.FC = () => {
	const dispatch = useAppDispatch();
	const currentBoard = useAppSelector(state => state.boards.current);
	const { data: boards } = useGetUserBoardsQuery("939264bb-6cc6-46a6-aaad-bbb3dca9fcf5");

	useEffect(() => {
		if (!boards) return;
		dispatch(setCurrentBoard(boards[0]));
	}, [boards]);

	useEffect(() => {
		if (!currentBoard) return;
		document.title = `${currentBoard.name} | Flow`;
	}, []);

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
								<Center>
									<VStack>
										<Spinner />
										<Heading>Loading your boards...</Heading>
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
