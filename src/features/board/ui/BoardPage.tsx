import { useEffect, useState } from "react";
import { FaFolderPlus } from "react-icons/fa";

import {
    Box, Button, Editable, EditableInput, EditablePreview, Heading, HStack, Input, Tooltip
} from "@chakra-ui/react";

import { useLazyGetUserBoardsQuery } from "../../../app/services/boards";
import { setCurrentBoard } from "../../../app/slices/board";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { iFolder } from "../../../utils/models";
import { EditCardModal } from "./components/EditCardModal";
import { Folder } from "./components/Folder";
import { MainDrawer } from "./components/MainDrawer";
import { NavBar } from "./components/NavBar";


const folders: iFolder[] = [
	{
		id: "folder1",
		boardId: "board1",
		name: "Folder 1",
		description: "This is folder 1",
	},
	{
		id: "folder2",
		boardId: "board1",
		name: "Folder 2",
		description: "This is folder 2",
	},
];

export const BoardPage: React.FC = () => {
	const dispatch = useAppDispatch();
	const [getUserBoards, { error: isErrorBoards }] = useLazyGetUserBoardsQuery();
	const currentBoard = useAppSelector(state => state.boards.current);

	useEffect(() => {
		(async () => {
			const boards = await getUserBoards("939264bb-6cc6-46a6-aaad-bbb3dca9fcf5").unwrap();
			if (boards) {
				dispatch(setCurrentBoard(boards[0]));
			}
		})();
	}, []);

	useEffect(() => {
		if (!currentBoard) return;
		document.title = `${currentBoard.name} | Flow`;
	}, []);

	const [isAddingFolder, setIsAddingFolder] = useState(false);

	const handleAddFolder = (folderName: string) => {
		if (folderName.length === 0) {
			setIsAddingFolder(false);
			return;
		}

		setIsAddingFolder(false);
		folders.push({
			id: "folder2",
			boardId: "board1",
			name: folderName,
			description: "",
		});
	};

	return (
		<>
			<NavBar />
			<Box p="10">
				<Heading mb="6">Hello World!</Heading>
				<HStack spacing="6" alignItems="start">
					{folders.map(folder => (
						<Folder folder={folder} key={folder.id} />
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
			<MainDrawer />
			<EditCardModal />
		</>
	);
};
