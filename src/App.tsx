// import "./assets/styles/index.css";

import { useCallback, useEffect, useState } from "react";
import { Route, Routes, useRoutes } from "react-router-dom";

import { Box, Center, Heading, Spinner, Text, VStack, Wrap } from "@chakra-ui/react";

import { useGetUserBoardsQuery, useLazyGetUserBoardsQuery } from "./app/services/boards";
import { setCurrentBoard } from "./app/slices/board";
import { Toast } from "./common-components/Toast";
import { BoardPage } from "./layouts/board/ui/BoardPage";
import { LandingPage } from "./layouts/landing/ui/LandingPage";
import { MainView } from "./layouts/main/ui/MainView";
import { SettingsPage } from "./layouts/settings/ui/SettingsPage";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { useAppSelector } from "./hooks/useAppSelector";
import { MOCK_USER_ID } from "./utils/mockData";

const App: React.FC = () => {
	const dispatch = useAppDispatch();

	return (
		<>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/home" element={<MainView />}>
					<Route path="board" element={<BoardPage />} />
					<Route path="settings" element={<SettingsPage />} />
				</Route>
			</Routes>
			<Toast />
		</>
	);
};

export default App;
