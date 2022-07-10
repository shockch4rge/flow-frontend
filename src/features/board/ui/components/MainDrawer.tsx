import { useCallback, useEffect } from "react";
import { FaChalkboard, FaChevronDown, FaCog } from "react-icons/fa";

import {
    Avatar, Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader,
    DrawerOverlay, Flex, HStack, Menu, MenuButton, MenuItem, MenuList, Text, VStack
} from "@chakra-ui/react";

import { useLazyGetUserBoardsQuery } from "../../../../app/services/boards";
import { setCurrentBoard } from "../../../../app/slices/board";
import { closeDrawer } from "../../../../app/slices/ui/drawers";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { iBoard } from "../../../../utils/models";


const boards: iBoard[] = [
	{
		id: "board1",
		authorId: "user1",
		name: "Board 1",
		description: "This is board 1",
		createdAt: "2020-01-01",
		updatedAt: "2020-01-01",
	},
	{
		id: "board2",
		authorId: "user1",
		name: "Board 2",
		description: "This is board 2",
		createdAt: "2020-01-01",
		updatedAt: "2020-01-01",
	},
];

export const MainDrawer: React.FC = () => {
	const dispatch = useAppDispatch();
	const [getUserBoards, { data: boards }] = useLazyGetUserBoardsQuery();
	const { open } = useAppSelector(state => state.ui.drawers.main);
	const user = useAppSelector(state => state.auth.currentUser);
	const currentBoard = useAppSelector(state => state.boards.current);

	useEffect(() => {
		user && getUserBoards(user.id);
	}, [boards]);

	const close = useCallback(() => dispatch(closeDrawer("main")), []);

	if (!boards) {
		return <>Loading...</>;
	}

	return (
		<Drawer isOpen={open} onClose={close} placement="left">
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton onClick={close} />
				<DrawerHeader>
					<HStack spacing={4}>
						<Avatar size="md" />
						<Text textAlign="start">Profile</Text>
					</HStack>
				</DrawerHeader>
				<DrawerBody>
					<VStack>
						<Menu matchWidth offset={[0, 8]}>
							<MenuButton
								w="100%"
								as={Button}
								bg="transparent"
								_hover={{
									bg: "green.50",
									textColor: "green.500",
								}}
								_active={{ bg: "green.100", textColor: "green.600" }}
								leftIcon={
									<HStack>
										<Box mr="2">
											<FaChalkboard size={24} />
										</Box>
										<Text fontWeight="light">
											{currentBoard?.name ?? "No board selected"}
										</Text>
									</HStack>
								}
								rightIcon={<FaChevronDown />}
							/>
							<MenuList>
								{boards.map(board => (
									<MenuItem
										key={board.id}
										onClick={() => {
											dispatch(setCurrentBoard(board));
											close();
										}}
									>
										{board.name}
									</MenuItem>
								))}
							</MenuList>
						</Menu>
						<Button
							w="100%"
							pos="relative"
							bg="transparent"
							_hover={{
								bg: "green.50",
								textColor: "green.500",
							}}
							_active={{
								bg: "green.100",
								textColor: "green.600",
							}}
							cursor="pointer"
						>
							<HStack py="2" px="4" left={0} pos="absolute" borderRadius={6}>
								<Box mr="2">
									<FaCog size={24} />
								</Box>
								<Text fontWeight="light">Settings</Text>
							</HStack>
						</Button>
					</VStack>
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
};
