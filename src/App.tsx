// import "./assets/styles/index.css";

import { useCallback, useEffect, useState } from "react";
import { Route, Routes, useRoutes } from "react-router-dom";

import { Box, Center, Heading, Spinner, Text, VStack, Wrap } from "@chakra-ui/react";

import { useGetUserBoardsQuery, useLazyGetUserBoardsQuery } from "./app/services/boards";
import { BoardPage } from "./layouts/board/ui/BoardPage";
import { LandingPage } from "./layouts/landing/ui/LandingPage";
import { MainView } from "./layouts/main/ui/MainView";
import { SettingsPage } from "./layouts/settings/ui/SettingsPage";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { Toast } from "./common-components/toast";
import { AuthProvider } from "./app/context/AuthContext";

const App: React.FC = () => {
	return (
		<>
			<AuthProvider>
				<Routes>
					<Route path="/" element={<LandingPage />} />
					<Route path="/home" element={<MainView />}>
						<Route path="board" element={<BoardPage />} />
						<Route path="settings" element={<SettingsPage />} />
					</Route>
				</Routes>
			</AuthProvider>
		</>
	);
};

export default App;
