import { useCallback, useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { FaFolderPlus } from "react-icons/fa";

import {
    Box, Button, Editable, EditableInput, EditablePreview, Heading, HStack, Input, Tooltip
} from "@chakra-ui/react";

import { useGetUserBoardsQuery, useLazyGetUserBoardsQuery } from "../../../app/services/boards";
import { useMoveCardMutation } from "../../../app/services/cards";
import { useAddFolderMutation, useGetBoardFoldersQuery } from "../../../app/services/folder";
import { setCurrentBoard } from "../../../app/slices/board";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { iBoard, iFolder } from "../../../utils/models";
import { MainNav } from "../../main/ui/components/MainNav";
import { EditCardModal } from "./components/EditCardModal";
import { Folder } from "./components/Folder";


interface Props {
	board: iBoard;
}

export const BoardPage: React.FC<Props> = props => {
	const dispatch = useAppDispatch();
	const { board } = props;
	const { data: folders, refetch: refetchFolders } = useGetBoardFoldersQuery(board.id);
	const [moveCard] = useMoveCardMutation();
	const [addFolder] = useAddFolderMutation();

	const [isAddingFolder, setIsAddingFolder] = useState(false);

	const handleAddFolder = async (folderName: string) => {
		if (folderName.length <= 0) {
			setIsAddingFolder(false);
			return;
		}

		setIsAddingFolder(false);
	};

	const onDragEnd = useCallback((result: DropResult) => {
		const { destination, source, draggableId } = result;

		if (!destination) return;
		if (destination.droppableId === source.droppableId && destination.index === source.index) return;

		moveCard({
			cardId: draggableId,
			folderId: destination.droppableId,
		}).then(() => refetchFolders());
	}, []);

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Box p="10">
				<Heading mb="6">{board.name}</Heading>
				<HStack spacing="6" alignItems="start" overflowX="scroll">
					{folders?.map(folder => (
						<Folder key={folder.id} folder={folder} />
					))}
					<Box w="64" p="2" bgColor="gray.200" borderRadius={6}>
						{isAddingFolder && (
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
							onClick={() => setIsAddingFolder(true)}
						>
							Add Folder
						</Button>
					</Box>
				</HStack>
			</Box>
			<EditCardModal />
		</DragDropContext>
	);
};
