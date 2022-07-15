import { useCallback, useEffect, useState } from "react";
import { FaChalkboard, FaChevronDown, FaCog, FaPaperPlane } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

import {
    Avatar, Box, Button, Center, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader,
    DrawerOverlay, Flex, HStack, Menu, MenuButton, MenuItem, MenuList, Spinner, Text, VStack
} from "@chakra-ui/react";

import { useGetUserBoardsQuery, useLazyGetUserBoardsQuery } from "../../../../app/services/boards";
import { setCurrentBoard } from "../../../../app/slices/board";
import { closeDrawer } from "../../../../app/slices/ui/drawers";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { iBoard } from "../../../../utils/models";
import { AppRoutes } from "../../../../utils/routes";


export const MainDrawer: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useAppDispatch();
	const currentBoard = useAppSelector(state => state.boards.current);
	const { open } = useAppSelector(state => state.ui.drawers.main);
	const { data: boards } = useGetUserBoardsQuery("939264bb-6cc6-46a6-aaad-bbb3dca9fcf5");
	const [viewIndex, setViewIndex] = useState(0);

	const close = useCallback(() => dispatch(closeDrawer("main")), []);

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
					{!boards ? (
						<VStack>
							<Spinner />
							<Text>Loading...</Text>
						</VStack>
					) : (
						<VStack>
							<Menu matchWidth offset={[0, 8]}>
								<MenuButton
									w="100%"
									as={Button}
									bg={viewIndex === 0 ? "gray.100" : "transparent"}
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
											<Text
												fontWeight="light"
												noOfLines={1}
												textOverflow="ellipsis"
												maxW="14ch"
											>
												{currentBoard?.name ?? "No board selected"}
											</Text>
										</HStack>
									}
									rightIcon={<FaChevronDown />}
								/>
								{boards && (
									<MenuList>
										{boards
											?.filter(b => b !== currentBoard)
											.map(board => (
												<MenuItem
													key={board.id}
													onClick={() => {
														setViewIndex(0);
														dispatch(setCurrentBoard(board));

														if (location.pathname === AppRoutes.Settings) {
															navigate(AppRoutes.Board);
														}

														close();
													}}
												>
													{board.name}
												</MenuItem>
											))}
									</MenuList>
								)}
							</Menu>
							<Button
								w="100%"
								pos="relative"
								bg={viewIndex === 1 ? "green.100" : "transparent"}
								_hover={{
									bg: "green.50",
									textColor: "green.500",
								}}
								_active={{
									bg: "green.100",
									textColor: "green.600",
								}}
								cursor="pointer"
								onClick={() => {
									setViewIndex(1);
									navigate(AppRoutes.Settings);
								}}
							>
								<HStack py="2" px="4" left={0} pos="absolute" borderRadius={6}>
									<Box mr="2">
										<FaCog size={24} />
									</Box>
									<Text fontWeight="light">Settings</Text>
								</HStack>
							</Button>
						</VStack>
					)}
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
};
