import { useEffect, useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";

import { Box, Center, Heading, HStack, Spinner, Text, VStack } from "@chakra-ui/react";

import { useGetUserBoardsQuery } from "../../../app/services/boards";
import { setCurrentBoard } from "../../../app/slices/board";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { MainSidebar } from "./components/MainSidebar";
import { iBoard } from "../../../utils/models";
import { AddBoardModal } from "./components/AddBoardModal";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useGetCurrentUserQuery } from "../../../app/services/auth";

export const MainView: React.FC = () => {
	const dispatch = useAppDispatch();
	const { user } = useAuthContext();
	const { data: boards, isLoading: isLoadingBoards } = useGetUserBoardsQuery(user!.id);

	

	return (
		<Box>
			<HStack h="100vh" overflow="hidden" spacing="0">
				<MainSidebar boards={boards} />
				{isLoadingBoards ? (
					<LoadingBoardsIndicator isLoading={isLoadingBoards} />
				) : (
					<Outlet />
				)}
			</HStack>
			<AddBoardModal />
		</Box>
	);
};

const LoadingBoardsIndicator: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
	const [pollingInterval, setPollingInterval] = useState(0);

	useEffect(() => {
		if (!isLoading) return;
		setTimeout(() => setPollingInterval(v => v + 10000), 10000);
	}, [isLoading]);

	return (
		<Center w="full">
			<VStack>
				<Spinner />
				<Heading>Loading your boards...</Heading>
				{pollingInterval > 0 && (
					<Text>
						We're having trouble at the moment. Refetching in {pollingInterval / 1000}{" "}
						seconds.
					</Text>
				)}
			</VStack>
		</Center>
	);
};
