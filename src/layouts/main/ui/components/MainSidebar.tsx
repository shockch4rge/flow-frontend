import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Box,
	Button,
	Divider,
	Flex,
	Icon,
	IconButton,
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
import { openModal } from "../../../../app/slices/ui/modals";

interface Props {
	boards?: iBoard[];
}

export const MainSidebar: React.FC<Props> = ({ boards }) => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const { isOpen: isSidebarOpen, onClose: closeSidebar, onOpen: openSidebar } = useDisclosure();
	const [accordionIndex, setAccordionIndex] = useState(-1);

	const closeAccordion = () => {
		setAccordionIndex(-1);
	};

	const openAccordion = (index: number) => {
		setAccordionIndex(index);
	};

	return (
		<Box
			w={isSidebarOpen ? "72" : "6.5rem"}
			minW={isSidebarOpen ? "72" : "6.5rem"}
			alignSelf="stretch"
			bgColor="gray.700"
			overflowX="hidden"
			transition="0.4s ease-in-out"
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
						<FlowLogo size={38} variant="full" color="light" />
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
						_hover={{ bg: "green.300", textColor: "black" }}
						_active={{ bg: "green.300", textColor: "black" }}
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
					{boards && (
						<Accordion w="full" allowToggle index={accordionIndex}>
							<AccordionItem borderRadius="lg" borderWidth="0px" borderBlockEnd="0px">
								<h2>
									<AccordionButton
										py="3"
										borderRadius="6"
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
										transition="0.2s ease-in"
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
											<Text
												opacity={isSidebarOpen ? "100%" : "0%"}
												transition="opacity 0.2s ease-in"
											>
												Boards
											</Text>
										</Flex>
										<AccordionIcon />
									</AccordionButton>
								</h2>
								{boards?.map((board, index) => {
									return (
										<>
											<AccordionPanel
												pt="4"
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
												<Divider />
											</AccordionPanel>
										</>
									);
								})}
								<AccordionPanel
									pt="5"
									bgColor="gray.700"
									_hover={{ bgColor: "gray.600" }}
									cursor="pointer"
									textColor="green.200"
									fontWeight="semibold"
									onClick={() => dispatch(openModal("addBoard"))}
									transition="0.1s ease-in"
								>
									Create new board
								</AccordionPanel>
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
						_hover={{ bg: "green.300", textColor: "black" }}
						_active={{ bg: "green.300", textColor: "black" }}
						fontSize="lg"
						onClick={() => navigate(AppRoutes.Settings)}
						overflowWrap="break-word"
						overflow="hidden"
					>
						<Icon mr="5" boxSize="1.4rem" as={FaCog} />
						<Text
							opacity={isSidebarOpen ? "100%" : "0%"}
							transition="opacity 0.2s ease-in"
						>
							Settings
						</Text>
					</Button>
				</VStack>
			</Box>
		</Box>
	);
};
