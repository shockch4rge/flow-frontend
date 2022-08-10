import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Avatar,
	Box,
	Button,
	Flex,
	Icon,
	IconButton,
	Image,
	Text,
	useDisclosure,
	VStack,
} from "@chakra-ui/react";

import { iBoard } from "../../../../utils/models";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { useLocation, useNavigate } from "react-router-dom";
import { FaChevronLeft, FaCog, FaTrello } from "react-icons/fa";
import { useState } from "react";
import { setCurrentBoard } from "../../../../app/slices/board";
import { AppRoutes } from "../../../../utils/routes";
import { FlowLogo } from "../../../../common-components";

interface Props {
	boards?: iBoard[];
}

export const MainSidebar: React.FC<Props> = ({ boards }) => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const {
		isOpen: isSidebarOpen,
		onClose: closeSidebar,
		onOpen: openSidebar,
		onToggle,
	} = useDisclosure();
	const [accordionIndex, setAccordionIndex] = useState(-1);

	const closeAccordion = () => {
		setAccordionIndex(-1);
	};

	const openAccordion = (index: number) => {
		setAccordionIndex(index);
	};

	return (
		<Box
			alignSelf="stretch"
			transition="0.4s ease-in-out"
			w={isSidebarOpen ? "72" : "6.5rem"}
			bgColor="gray.700"
			overflowX="hidden"
		>
			<Box pos="sticky" mx="6">
				<Flex h="20" alignItems="center" justifyContent="space-between" position="relative">
					<Flex
						alignItems="center"
						gap={2}
						opacity={isSidebarOpen ? "1" : "0"}
						transition="0.2s ease-in"
						overflowWrap="break-word"
						overflow="hidden"
					>
						<FlowLogo size={36} variant="full" color="light" />
					</Flex>

					<IconButton
						icon={
							<Icon
								as={FaChevronLeft}
								transform={`rotate(${isSidebarOpen ? "0deg" : "180deg"})`}
								transition="opacity 0.2s ease-in, transform 0.2s ease-in"
							/>
						}
						aria-label="Toggle sidebar expansion"
						p="4"
						ml="auto"
						size="xl"
						color="white"
						bg="whiteAlpha.200"
						borderRadius="lg"
						_hover={{ bg: "teal.200", color: "black" }}
						onClick={() => {
							if (isSidebarOpen) {
								closeAccordion();
								closeSidebar();
								return;
							}

							openSidebar();
						}}
					/>
				</Flex>

				<VStack mt={4} spacing="2">
					{boards && boards.length > 0 && (
						<Accordion w="full" allowToggle index={accordionIndex}>
							<AccordionItem borderRadius="lg" borderWidth="0px" borderBlockEnd="0px">
								<h2>
									<AccordionButton
										py="3"
										borderRadius="6"
										transition="all 0.2s ease-in"
										overflow="hidden"
										fontWeight="bold"
										_hover={
											location.pathname !== AppRoutes.Board
												? { bgColor: "green.300", textColor: "black" }
												: {}
										}
										textColor={
											location.pathname === AppRoutes.Board
												? "black"
												: "white"
										}
										bgColor={
											location.pathname === AppRoutes.Board
												? "green.300"
												: "whiteAlpha.200"
										}
										onClick={() => {
											if (isSidebarOpen && accordionIndex === -1) {
												openAccordion(0);
												return;
											}

											if (isSidebarOpen && accordionIndex >= 0) {
												closeAccordion();
												return;
											}

											if (!isSidebarOpen && accordionIndex === -1) {
												openSidebar();
												return;
											}
										}}
									>
										<Flex
											flex="1"
											textAlign="start"
											fontSize="lg"
											whiteSpace="nowrap"
											alignItems="center"
										>
											<Box mr="5">
												<FaTrello size="24" />
											</Box>
											<Text>Boards</Text>
										</Flex>
										<AccordionIcon />
									</AccordionButton>
								</h2>
								{boards?.map((board, index) => {
									return (
										<AccordionPanel
											key={board.id}
											bgColor="gray.700"
											_hover={{ bgColor: "gray.600" }}
											transition="0.1s ease-in"
											cursor="pointer"
											textColor="gray.200"
											onClick={() => {
												dispatch(setCurrentBoard(board));
												localStorage.setItem(
													"lastEditedBoard",
													index.toString()
												);
												navigate(AppRoutes.Board);
											}}
										>
											{board.name}
										</AccordionPanel>
									);
								})}
							</AccordionItem>
						</Accordion>
					)}
					<Button
						size="xl"
						w="full"
						p="4"
						borderRadius="lg"
						justifyContent="start"
						cursor="pointer"
						bgColor={
							location.pathname === AppRoutes.Settings
								? "green.300"
								: "whiteAlpha.200"
						}
						textColor={location.pathname === AppRoutes.Settings ? "black" : "white"}
						_hover={{ bgColor: "green.2s00", textColor: "black" }}
						fontSize="lg"
						onClick={() => navigate(AppRoutes.Settings)}
						overflowWrap="break-word"
						overflow="hidden"
					>
						<Box mr="4">
							<FaCog size="24" />
						</Box>
						<Text opacity={isSidebarOpen ? "100%" : "0%"}>Settings</Text>
					</Button>

					{/* {sidebarItems.map((item, index) => (
						<SidebarItem
							key={index}
							icon={item.icon}
							link={item.link}
							isSidebarOpen={isSidebarOpen}
							tooltipLabel={item.name}
						>
							<Text
								fontSize="md"
								opacity={isSidebarOpen ? "1" : "0"}
								transition="opacity 0.2s ease-in"
							>
								{item.name}
							</Text>
						</SidebarItem>
					))} */}
				</VStack>
			</Box>
		</Box>
	);

	/*
	return (
		<Box
			h="full"
			w={isSidebarOpen ? "96" : "20"}
			p="4"
			bgColor="gray.700"
			// onMouseEnter={() => setIsHovered(true)}
			// onMouseLeave={() => setIsHovered(false)}
			transition="all 1s cubic-ease-in-out"
			overflow="hidden"
		>
			<VStack spacing="6" align={isSidebarOpen ? "start" : "center"}>
				<Avatar size="md" onClick={() => navigate(AppRoutes.Settings)} />
				<IconButton aria-label="Expand sidebar" onClick={onToggle}>
					<FaLongArrowAltRight />
				</IconButton>
				<Divider />
				<Menu offset={[0, 15]} preventOverflow={true}>
					<MenuButton
						as={IconButton}
						size="lg"
						aria-label="Boards"
						variant="sidebar"
						borderRadius="12"
						_active={{ border: "3px solid" }}
						icon={<FaChalkboard size={24} />}
					/>
					<MenuList>
						{boards?.map(board => (
							<MenuItem
								key={board.id}
								onClick={() => {
									if (location.pathname !== AppRoutes.Board) {
										navigate(AppRoutes.Board);
									}
									dispatch(setCurrentBoard(board));
								}}
							>
								<Text>{board.name}</Text>
							</MenuItem>
						))}
					</MenuList>
				</Menu>
				<Tooltip label="Settings" hasArrow placement="right" openDelay={500}>
					<IconButton
						size="lg"
						aria-label="Settings"
						variant="sidebar"
						borderRadius="12"
						_active={{ border: "3px solid" }}
						onClick={() => {
							navigate(AppRoutes.Settings);
						}}
					>
						<FaCog size={24} />
					</IconButton>
				</Tooltip>
			</VStack>
		</Box>
	);
	*/
};
