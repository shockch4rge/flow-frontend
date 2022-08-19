import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { Box, Center, Heading, HStack, Spinner, Text, VStack } from "@chakra-ui/react";

import { useGetUserBoardsQuery, useLazyGetUserBoardsQuery } from "../../../app/services/boards";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { AddBoardModal } from "./components/AddBoardModal";
import { MainSidebar } from "./components/MainSidebar";

export const MainView: React.FC = () => {
    const dispatch = useAppDispatch();
    const { user } = useAuthContext();
    const [getUserBoards, { data: boards, isLoading: isLoadingBoards }] =
        useLazyGetUserBoardsQuery();

    useEffect(() => {
        if (!user) return;

        getUserBoards(user.id).unwrap();
    }, [user]);

    return (
        <Box>
            {isLoadingBoards || !boards ? (
                <LoadingBoardsIndicator />
            ) : (
                <HStack h="100vh" overflow="hidden" spacing="0">
                    <MainSidebar boards={boards} />
                    <Outlet />
                </HStack>
            )}
            <AddBoardModal />
        </Box>
    );
};

const LoadingBoardsIndicator: React.FC<{}> = () => {
    return (
        <Center h="100vh">
            <VStack>
                <Spinner />
                <Heading>Loading your boards...</Heading>
            </VStack>
        </Center>
    );
};
