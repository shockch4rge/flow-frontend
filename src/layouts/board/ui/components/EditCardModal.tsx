import { Select } from "chakra-react-select";
import moment from "moment";
import { useMemo, useRef, useState } from "react";
import {
    FaCheck, FaCheckSquare, FaCross, FaPlus, FaStickyNote, FaTimes, FaTrash, FaXing
} from "react-icons/fa";

import {
    Box, Button, ButtonGroup, Checkbox, Editable, EditableInput, EditablePreview, EditableTextarea,
    Flex, Heading, HStack, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent,
    ModalFooter, ModalHeader, ModalOverlay, Popover, PopoverArrow, PopoverBody, PopoverCloseButton,
    PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, Spacer, Spinner, Stack, Tag,
    TagCloseButton, TagRightIcon, Text, Textarea, Tooltip, useDisclosure, useToast, VStack, Wrap,
    WrapItem
} from "@chakra-ui/react";

import { useDeleteCardMutation, useEditCardMutation } from "../../../../app/services/cards";
import { useAddChecklistMutation } from "../../../../app/services/checklists";
import { useAddNotepadMutation, useDeleteNotepadMutation } from "../../../../app/services/notepads";
import { closeModal } from "../../../../app/slices/ui/modals";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { iCard, iChecklist, iNotepad } from "../../../../utils/models";

const modalName = "editCard";

export const EditCardModal: React.FC = () => {
    const toast = useToast();
    const dispatch = useAppDispatch();
    const { open, target } = useAppSelector(state => state.ui.modals[modalName]);
    const [editCard, { isLoading: isEditing }] = useEditCardMutation();
    const [deleteCard, { isLoading: isDeletingCard, isSuccess: hasDeletedCard }] =
        useDeleteCardMutation();
    const [isAddingTagMode, setIsAddingTagMode] = useState(false);

    const close = () => void dispatch(closeModal(modalName));

    const handleAddTag = (tagName: string) => {
        if (tagName.length === 0) {
            setIsAddingTagMode(false);
            return;
        }

        setIsAddingTagMode(false);
    };

    const handleEditName = async (name: string) => {
        if (!target) return;

        try {
            await editCard({
                id: target.id,
                folderId: target.folderId,
                name,
            }).unwrap();
        } catch (e) {
            toast({
                description: "Could not edit name. Please try again.",
                status: "error",
            });
        }
    };

    const handleDeleteCard = async () => {
        if (!target) return;

        try {
            await deleteCard(target.id).unwrap();
            close();
            toast({
                description: `${target.name} deleted!`,
                status: "success",
            });
        } catch (e) {
            toast({
                description: "There was an error deleting the card. Please try again.",
                status: "error",
            });
        }
    };

    if (!target) return <></>;

    return (
        <Modal
            isOpen={open}
            onClose={close}
            size={["lg", "xl", "3xl", "4xl"]}
            closeOnOverlayClick={false}
            autoFocus={false}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader as={HStack}>
                    <Tooltip label="Click to edit" hasArrow openDelay={1000}>
                        <Editable
                            flex="1"
                            defaultValue={target.name}
                            borderRadius="6"
                            isPreviewFocusable
                            selectAllOnFocus
                            submitOnBlur={false}
                            onSubmit={handleEditName}
                            _hover={{
                                bg: "gray.50",
                            }}
                        >
                            <EditablePreview py={2} px={4} w="100%" />
                            <Input py={2} px={4} as={EditableInput} />
                        </Editable>
                    </Tooltip>
                    <IconButton aria-label="Delete card" onClick={handleDeleteCard}>
                        {isDeletingCard ? <Spinner /> : <FaTrash />}
                    </IconButton>
                </ModalHeader>

                <ModalBody>
                    <Flex direction="row">
                        <VStack mr="6" p="4" flex="3" align="stretch" spacing="12">
                            <Box>
                                <Heading size="md">Tags</Heading>
                                <TagBuilder cardId={target.id} />
                            </Box>

                            <Box>
                                <Heading size="md">Description</Heading>
                                <Editable
                                    mt="3"
                                    noOfLines={3}
                                    defaultValue={
                                        target.description === ""
                                            ? "No description provided."
                                            : target.description
                                    }
                                >
                                    <EditablePreview />
                                    <EditableTextarea resize="none" />
                                </Editable>
                            </Box>

                            {target.checklists.length > 0 && <ChecklistBuilder card={target} />}
                            {target.notepads.length > 0 && <NotepadBuilder card={target} />}

                            <VStack align="start" spacing="4">
                                <Heading size="md">Comments</Heading>
                                {target.comments.length > 0 && <CommentBuilder card={target} />}
                            </VStack>
                        </VStack>

                        <Flex flex="1" p="4" align="start" direction="column">
                            <VStack align="start" w="full">
                                <Heading size="md">Add Components</Heading>
                                <VStack
                                    w="full"
                                    mt="4"
                                    p="2"
                                    borderRadius="6"
                                    bgColor="gray.100"
                                    align="center"
                                >
                                    <ChecklistButton cardId={target.id} />
                                    <NotepadButton cardId={target.id} />
                                </VStack>
                            </VStack>
                            <Spacer />
                            <DueDateBuilder card={target} />
                        </Flex>
                    </Flex>
                </ModalBody>

                <ModalFooter>
                    <HStack>
                        <Button onClick={close}>Cancel</Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                // save edits
                                close();
                            }}
                        >
                            Save
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

const DueDateBuilder: React.FC<{ card: iCard }> = ({ card }) => {
    const initialFocusRef = useRef(null);
    const { isOpen, onClose, onToggle } = useDisclosure();
    const [dueDate, setDueDate] = useState(card.dueDate);
    const [editCard, { isLoading: isEditing }] = useEditCardMutation();

    const handleEdit = async (e: any) => {
        console.log(e.target.value);

        // await editCard({

        // }).unwrap();
    };

    return (
        <Popover
            returnFocusOnClose={false}
            isOpen={isOpen}
            onClose={onClose}
            initialFocusRef={initialFocusRef}
        >
            <PopoverTrigger>
                <Button w="full" onClick={onToggle}>
                    Set Due Date
                </Button>
            </PopoverTrigger>
            <PopoverContent p="2" borderWidth="medium" borderColor="gray.100">
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody pt="8" pb="4">
                    <Input
                        ref={initialFocusRef}
                        type="datetime-local"
                        defaultValue={(() => {
                            // const dueDate = card.dueDate;
                            // if (!dueDate) return undefined;

                            const date = new Date();

                            const string = moment(date).format("YYYY-MM-DDThh:mm:ss");

                            return string;
                        })()}
                        onChange={(e: any) => console.log(e.target.value)}
                    />
                </PopoverBody>
                <PopoverFooter gap="4" border="0" display="flex" justifyContent="end">
                    <ButtonGroup size="sm" isDisabled={isEditing}>
                        <IconButton aria-label="Cancel" variant="outline" onClick={onClose}>
                            {isEditing ? <Spinner /> : <FaTimes />}
                        </IconButton>
                        <IconButton
                            aria-label="Set due date"
                            variant="primary"
                            onClick={handleEdit}
                        >
                            {isEditing ? <Spinner /> : <FaCheck />}
                        </IconButton>
                    </ButtonGroup>
                </PopoverFooter>
            </PopoverContent>
        </Popover>
    );
};

const CommentBuilder: React.FC<{ card: iCard }> = ({ card }) => {
    const [comment, setComment] = useState("");

    return (
        <VStack>
            {card.comments.map(comment => (
                <VStack spacing="4">
                    <Text fontSize="sm">{comment.content}</Text>
                </VStack>
            ))}
            <Input
                placeholder="Add a comment...."
                onChange={(e: any) => setComment(e.target.value)}
            />
        </VStack>
    );
};

const ChecklistButton: React.FC<Pick<iChecklist, "cardId">> = ({ cardId }) => {
    const toast = useToast();
    const [name, setName] = useState("");
    const initialFocusRef = useRef(null);
    const [description, setDescription] = useState("");
    const [addChecklist, { isLoading: isAdding }] = useAddChecklistMutation();
    const { isOpen, onToggle, onClose } = useDisclosure();

    const handleAdd = async () => {
        if (name === "") {
            toast({
                description: "Checklist name must not be empty.",
                status: "error",
            });
            return;
        }

        try {
            await addChecklist({
                cardId,
                name,
                description,
            }).unwrap();
            onClose();
        } catch (e) {
            console.warn(e);
            toast({
                description: "There was an error adding the checklist.",
                status: "error",
            });
        }
    };

    return (
        <Popover
            returnFocusOnClose={false}
            isOpen={isOpen}
            onClose={onClose}
            initialFocusRef={initialFocusRef}
        >
            <PopoverTrigger>
                <Button
                    w="full"
                    bg="white"
                    leftIcon={<FaCheckSquare />}
                    fontWeight="medium"
                    onClick={onToggle}
                >
                    Checklists
                </Button>
            </PopoverTrigger>
            <PopoverContent p="2" borderWidth="medium" borderColor="gray.100">
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader border="0">
                    <Heading size="md">Add Checklist</Heading>
                </PopoverHeader>
                <PopoverBody>
                    <VStack my="2" spacing="2">
                        <Input
                            ref={initialFocusRef}
                            placeholder="Name"
                            onChange={(e: any) => setName(e.target.value)}
                        />
                        <Input
                            placeholder="Description"
                            onChange={(e: any) => setDescription(e.target.value)}
                        />
                    </VStack>
                </PopoverBody>
                <PopoverFooter gap="4" border="0" display="flex" justifyContent="end">
                    <ButtonGroup size="sm" isDisabled={isAdding}>
                        <IconButton aria-label="Cancel" variant="outline" onClick={onClose}>
                            {isAdding ? <Spinner /> : <FaTimes />}
                        </IconButton>
                        <IconButton
                            aria-label="Add Checklist"
                            variant="primary"
                            onClick={handleAdd}
                        >
                            {isAdding ? <Spinner /> : <FaCheck />}
                        </IconButton>
                    </ButtonGroup>
                </PopoverFooter>
            </PopoverContent>
        </Popover>
    );
};

const ChecklistBuilder: React.FC<{ card: iCard }> = ({ card }) => {
    return (
        <Box>
            <Heading size="md">Checklists</Heading>
            <VStack spacing="4">
                {card.checklists.map(checklist => (
                    <VStack>
                        <Heading size="md">{checklist.name}</Heading>
                        <VStack>
                            {checklist.items.map(item => (
                                <Checkbox defaultChecked={item.checked}>{item.name}</Checkbox>
                            ))}
                        </VStack>
                    </VStack>
                ))}
            </VStack>
        </Box>
    );
};

const ChecklistItemBuilder: React.FC<Pick<iChecklist, "cardId">> = ({ cardId }) => {
    return <></>;
};

const NotepadButton: React.FC<Pick<iNotepad, "cardId">> = ({ cardId }) => {
    const toast = useToast();
    const [content, setContent] = useState("");
    const [addNotepad, { isLoading: isAdding }] = useAddNotepadMutation();
    const initialFocusRef = useRef(null);
    const { isOpen, onToggle, onClose } = useDisclosure();

    const handleAdd = async () => {
        if (content === "") {
            toast({
                description: "Notepad content must not be empty!",
                status: "error",
            });
        }

        try {
            await addNotepad({ cardId, content }).unwrap();
            onClose();
            toast({
                description: "Notepad added.",
                status: "success",
            });
        } catch (e) {
            console.warn(e);
            toast({
                description: "There was an error adding the notepad.",
                status: "error",
            });
        }
    };

    return (
        <Popover
            returnFocusOnClose={false}
            isOpen={isOpen}
            onClose={onClose}
            closeOnBlur={!isAdding}
            initialFocusRef={initialFocusRef}
        >
            <PopoverTrigger>
                <Button
                    w="full"
                    bg="white"
                    leftIcon={<FaStickyNote />}
                    fontWeight="medium"
                    onClick={onToggle}
                >
                    Notepads
                </Button>
            </PopoverTrigger>
            <PopoverContent p="2" borderWidth="medium" borderColor="gray.100">
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader border="0">
                    <Heading size="md">Add Notepad</Heading>
                </PopoverHeader>
                <PopoverBody>
                    <Textarea
                        ref={initialFocusRef}
                        resize="none"
                        placeholder="Content"
                        onChange={(e: any) => setContent(e.target.value)}
                    />
                </PopoverBody>
                <PopoverFooter gap="4" border="0" display="flex" justifyContent="end">
                    <ButtonGroup size="sm" isDisabled={isAdding}>
                        <IconButton aria-label="Cancel" variant="outline" onClick={onClose}>
                            {isAdding ? <Spinner /> : <FaTimes />}
                        </IconButton>
                        <IconButton aria-label="Add Notepad" variant="primary" onClick={handleAdd}>
                            {isAdding ? <Spinner /> : <FaCheck />}
                        </IconButton>
                    </ButtonGroup>
                </PopoverFooter>
            </PopoverContent>
        </Popover>
    );
};

const NotepadBuilder: React.FC<{ card: iCard }> = ({ card }) => {
    const toast = useToast();
    const [deleteNotepad] = useDeleteNotepadMutation();

    const handleDelete = async (id: string) => {
        try {
            await deleteNotepad({ cardId: card.id, id }).unwrap();
            toast({
                description: "Notepad deleted.",
                status: "success",
            });
        } catch (e) {
            toast({
                description: "There was an error deleting the notepad.",
                status: "error",
            });
            console.warn(e);
        }
    };

    return (
        <VStack align="start" spacing="4" w="full">
            <Heading size="md">Notepads</Heading>
            <VStack spacing="2" w="inherit">
                {card.notepads.map(notepad => (
                    <Flex w="inherit" p="2" borderRadius="md" borderWidth="thin">
                        <Text>{notepad.content}</Text>
                        <Spacer />
                        <IconButton
                            aria-label="Delete notepad"
                            onClick={() => handleDelete(notepad.id)}
                        >
                            <FaTrash />
                        </IconButton>
                    </Flex>
                ))}
            </VStack>
        </VStack>
    );
};

const TagBuilder: React.FC<{ cardId: string }> = ({ cardId }) => {
    const currentBoard = useAppSelector(state => state.boards.current);

    const options = [
        {
            value: "COMT",
            label: "COMT",
        },
        {
            value: "UXID",
            label: "UXID",
        },
        {
            value: "NETY",
            label: "NETY",
        },
    ];

    if (!currentBoard) return <></>;

    return (
        <Box mt="4">
            <Select
                size="md"
                options={currentBoard.tags.map(tag => ({
                    value: tag.name,
                    label: tag.name,
                }))}
                isMulti
                backspaceRemovesValue
            />
        </Box>
    );
};
