import { useEffect, useState } from "react";

import {
    Button, Editable, EditableInput, EditablePreview, Input, Modal, ModalBody, ModalCloseButton,
    ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Tooltip, useToast
} from "@chakra-ui/react";

import { useAddBoardMutation } from "../../../../app/services/boards";
import { setCurrentBoard } from "../../../../app/slices/board";
import { closeModal } from "../../../../app/slices/ui/modals";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { useAuthContext } from "../../../../hooks/useAuthContext";

export const AddBoardModal: React.FC = () => {
    const toast = useToast();
    const dispatch = useAppDispatch();
    const { user } = useAuthContext();
    const [name, setName] = useState("");
    const { open } = useAppSelector(state => state.ui.modals["addBoard"]);
    const [addBoard, { isLoading: isAddingBoard }] = useAddBoardMutation();

    const close = () => {
        dispatch(closeModal("addBoard"));
    };

    const handleAddBoard = async () => {
        try {
            const board = await addBoard({
                authorId: user!.id,
                name,
            }).unwrap();
            dispatch(setCurrentBoard(board));
            toast({
                description: `'${board.name}' created!`,
                status: "success",
            });
            close();
        } catch (e) {
            toast({
                description: "There was an error creating a board.",
                status: "error",
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
