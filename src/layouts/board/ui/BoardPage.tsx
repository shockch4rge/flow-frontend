import { useCallback, useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { FaBars, FaBox, FaCog, FaCogs, FaFolderPlus, FaHamburger } from "react-icons/fa";

import {
	Box,
	Button,
	Center,
	Editable,
	EditableInput,
	EditablePreview,
	Flex,
	Heading,
	HStack,
	IconButton,
	Input,
	Spacer,
	Spinner,
	Text,
	Tooltip,
	VStack,
} from "@chakra-ui/react";

import { useMoveCardMutation } from "../../../app/services/cards";
import {
	useAddFolderMutation,
	useGetBoardFoldersQuery,
	useMoveFolderMutation,
} from "../../../app/services/folder";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { StrictModeDroppable } from "../../../utils/StrictModeDroppable";
import { EditCardModal } from "./components/EditCardModal";
import { Folder } from "./components/Folder";
import { useBoards } from "../../main/ui/MainView";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { EditFolderModal } from "./components/EditFolderModal";
import { Toast } from "../../../common-components/toast";

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

const CreateNewBoardPage: React.FC<{}> = () => {
	return (
		<Center>
			<Heading>Create a new board</Heading>
		</Center>
	);
};

export const BoardPage: React.FC<{}> = props => {
	const dispatch = useAppDispatch();
	const { currentBoard, isLoadingBoards } = useBoards();
	const [isAddingFolderMode, setIsAddingFolderMode] = useState(false);
	const { data: folders } = useGetBoardFoldersQuery(currentBoard.id);
	const [moveCard] = useMoveCardMutation();
	const [moveFolder] = useMoveFolderMutation();
	const [addFolder] = useAddFolderMutation();

	const onDragEnd = useCallback(async (result: DropResult) => {
		const { destination, source, draggableId, type } = result;

		if (!destination) return;
		if (destination.droppableId === source.droppableId && destination.index === source.index)
			return;

		if (type === "folder") {
			console.log("moving folder");
			return;
		}

		await moveCard({
			id: draggableId,
			folderId: destination.droppableId,
			index: destination.index,
		});
	}, []);

	const handleAddFolder = async (folderName: string) => {
		if (folderName.length <= 0) {
			setIsAddingFolderMode(false);
			return;
		}

		setIsAddingFolderMode(false);

		try {
			await addFolder({
				name: folderName,
				boardId: currentBoard.id,
			}).unwrap();
			Toast({ description: `${folderName} created!`, colorScheme: "green" });
		} catch (e) {
			console.log(e);
			Toast({
				description: "Could not add folder. Please try again.",
				colorScheme: "green",
			});
		}
	};

	if (isLoadingBoards) return <LoadingBoardsIndicator isLoading={isLoadingBoards} />;

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<VStack
				align="start"
				w="full"
				h="full"
				p="8"
				spacing="6"
				overflowY="hidden"
				bgColor="white"
			>
				<HStack spacing="8">
					<Heading ml="4">{currentBoard.name}</Heading>
					<IconButton aria-label="Board Settings" size="lg">
						<FaCog />
					</IconButton>
				</HStack>
				<StrictModeDroppable
					droppableId={currentBoard.id}
					direction="horizontal"
					type="folder"
				>
					{({ droppableProps, innerRef, placeholder }, snap) => (
						<HStack align="start" borderRadius="8">
							<Flex
								ref={innerRef}
								p="4"
								pr="-4"
								borderRadius="8"
								alignItems="start"
								direction="row"
								bgColor={snap.isDraggingOver ? "gray.50" : "transparent"}
								transition="background-color 0.2s ease-in-out"
								{...droppableProps}
							>
								{folders?.map((folder, index) => (
									<Draggable
										key={folder.id}
										draggableId={folder.id}
										index={index}
									>
										{({ innerRef, draggableProps, dragHandleProps }, snap) => (
											<Box
												ref={innerRef}
												{...draggableProps}
												{...dragHandleProps}
												mr="6"
											>
												<Folder
													folder={folder}
													toggleSelection={cardId => {}}
													toggleSelectionInGroup={cardId => {}}
													multiSelectTo={newCardId => {}}
												/>
											</Box>
										)}
									</Draggable>
								))}
								{placeholder}
							</Flex>
							<Box pt="4">
								<Box w="64" p="2" bgColor="gray.200" borderRadius={6}>
									{isAddingFolderMode && (
										<Editable
											w="100%"
											mb="2"
											defaultValue="New folder"
											isPreviewFocusable
											selectAllOnFocus
											startWithEditView
											onSubmit={handleAddFolder}
										>
											<EditablePreview w="100%" py={2} px={2} bg="gray.50" />
											<Input py={2} px={4} as={EditableInput} />
										</Editable>
									)}
									<Button
										w="100%"
										bg="transparent"
										_hover={{ bgColor: "gray.100" }}
										_active={{ bgColor: "gray.50" }}
										leftIcon={<FaFolderPlus />}
										textColor="gray.400"
										fontWeight="light"
										onClick={() => setIsAddingFolderMode(true)}
									>
										Add Folder
									</Button>
								</Box>
							</Box>
						</HStack>
					)}
				</StrictModeDroppable>
			</VStack>

			<EditCardModal />
			<EditFolderModal />
		</DragDropContext>
	);
};
