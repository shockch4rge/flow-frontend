import "./assets/styles/index.css";

import { useCallback, useEffect } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRoutes } from "react-router-dom";

import { useGetUserBoardsQuery, useLazyGetUserBoardsQuery } from "./app/services/boards";
import { setCurrentBoard } from "./app/slices/board";
import { BoardPage } from "./features/board/ui/BoardPage";
import { HomePage } from "./features/home/ui/HomePage";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { useAppSelector } from "./hooks/useAppSelector";


const App: React.FC = () => {
	const dispatch = useAppDispatch();
	

	const onDragEnd = useCallback((result: DropResult) => {
		//
	}, []);

	const routes = useRoutes([
		{
			path: "/",
			element: <HomePage />,
		},
		{
			path: "/boards",
			element: <BoardPage />,
		},
	]);

	return (
		<>
			<DragDropContext onDragEnd={onDragEnd}>{routes}</DragDropContext>
		</>
	);
};

export default App;
