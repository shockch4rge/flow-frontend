import {
	Button,
	Editable,
	EditableInput,
	EditablePreview,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Spinner,
	Tooltip,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAddBoardMutation } from "../../../../app/services/boards";
import { setCurrentBoard } from "../../../../app/slices/board";
import { closeModal } from "../../../../app/slices/ui/modals";
import { Toast } from "../../../../common-components/toast";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { MOCK_USER_ID } from "../../../../utils/mockData";

export const AddBoardModal: React.FC = () => {
	const dispatch = useAppDispatch();
	const { open } = useAppSelector(state => state.ui.modals["addBoard"]);
	const [name, setName] = useState("");
	const [addBoard, { isLoading: isAddingBoard }] = useAddBoardMutation();

	const close = () => {
		dispatch(closeModal("addBoard"));
	};

	const handleAddBoard = async () => {
		try {
			const board = await addBoard({
				authorId: MOCK_USER_ID,
				name,
			}).unwrap();
			dispatch(setCurrentBoard(board));
			close();
		} catch (e) {
			Toast({
				description: "There was an error creating a board.",
				colorScheme: "red",
			});
			console.log(e as Error);
		}
	};

	return (
		<Modal isOpen={open} onClose={close} isCentered size="lg">
			<ModalOverlay />
			<ModalContent>
				<ModalCloseButton />
				<ModalHeader>Create a new board</ModalHeader>
				<ModalBody>
					<Tooltip label="Click to edit" hasArrow openDelay={1000}>
						<Editable
							flex="1"
							defaultValue="New Board"
							borderRadius="6"
							isPreviewFocusable
							selectAllOnFocus
							bgColor="gray.50"
							onChange={(v: string) => setName(v)}
						>
							<EditablePreview py="2" px="4" w="100%" />
							<Input py="2" px="4" as={EditableInput} />
						</Editable>
					</Tooltip>
				</ModalBody>
				<ModalFooter>
					<Button variant="primary" onClick={handleAddBoard} disabled={isAddingBoard}>
						{isAddingBoard ? <Spinner /> : "Create"}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
