import { CreatableSelect, Select } from "chakra-react-select";
import { Field, Form, Formik } from "formik";
import moment from "moment";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    FaCheck, FaCheckSquare, FaCross, FaPlus, FaStickyNote, FaTimes, FaTrash, FaXing
} from "react-icons/fa";
import * as Yup from "yup";

import {
    Box, Button, ButtonGroup, Checkbox, Editable, EditableInput, EditablePreview, EditableTextarea,
    Flex, FormControl, Heading, HStack, IconButton, Input, InputGroup, InputRightElement, Modal,
    ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Popover,
    PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader,
    PopoverTrigger, Progress, Spacer, Spinner, Text, Textarea, Tooltip, useDisclosure, useToast,
    VStack, Wrap, WrapItem
} from "@chakra-ui/react";

import { useDeleteCardMutation, useEditCardMutation } from "../../../../app/services/cards";
import {
    useAddChecklistItemMutation, useAddChecklistMutation, useDeleteChecklistMutation,
    useToggleChecklistItemMutation
} from "../../../../app/services/checklists";
import {
    useAddCommentMutation, useDeleteCommentMutation, useEditCommentMutation
} from "../../../../app/services/comments";
import { useAddNotepadMutation, useDeleteNotepadMutation } from "../../../../app/services/notepads";
import { useAssignTagsToCardMutation, useCreateTagMutation } from "../../../../app/services/tags";
import { closeModal } from "../../../../app/slices/ui/modals";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import { iCard, iChecklist, iChecklistItem, iComment, iNotepad } from "../../../../utils/models";

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
                                <TagBuilder card={target} />
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

                            {target.checklists.length > 0 && (
                                <VStack align="start">
                                    <Heading size="md">Checklists</Heading>
                                    <VStack
                                        align="start"
                                        w="full"
                                        maxH="72"
                                        spacing="6"
                                        overflowY="scroll"
                                    >
                                        {target.checklists.map(checklist => (
                                            <ChecklistBuilder checklist={checklist} />
                                        ))}
                                    </VStack>
                                </VStack>
                            )}
                            {target.notepads.length > 0 && <NotepadBuilder card={target} />}

                            <VStack align="start" spacing="4">
                                <Heading size="md">Comments</Heading>
                                {target.comments.length > 0 && (
                                    <VStack spacing="4" w="full" maxH="64" overflowY="scroll">
                                        {target.comments.map(comment => (
                                            <CommentDisplay comment={comment} card={target} />
                                        ))}
                                    </VStack>
                                )}
                                <CommentBuilder card={target} />
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
                            {/* <DueDateBuilder card={target} /> */}
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
    const toast = useToast();
    const { user } = useAuthContext();
    const [addComment] = useAddCommentMutation();

    const handleAdd = async (content: string) => {
        if (content === "") return;

        try {
            await addComment({
                cardId: card.id,
                authorId: user!.id,
                content,
            }).unwrap();
            toast({
                description: "Added comment!",
                status: "success",
            });
        } catch (e) {
            console.log(e);
            toast({
                description: "There was an error adding the comment. Please try again.",
                status: "error",
            });
        }
    };

    return (
        <Box w="full">
            <Formik
                onSubmit={({ content }, { resetForm }) => {
                    handleAdd(content);
                    resetForm();
                }}
                initialValues={{
                    content: "",
                }}
            >
                {({ getFieldProps }) => (
                    <Form autoComplete="off">
                        <Field name="content">
                            {(props: any) => (
                                <InputGroup>
                                    <Input
                                        {...getFieldProps("content")}
                                        id={"content"}
                                        placeholder="Add a comment...."
                                    />
                                    <InputRightElement w="4rem">
                                        <Button size="sm" type="submit">
                                            Post
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            )}
                        </Field>
                    </Form>
                )}
            </Formik>
        </Box>
    );
};

const CommentDisplay: React.FC<{ comment: iComment; card: iCard }> = ({ comment, card }) => {
    const toast = useToast();
    const initialFocusRef = useRef(null);
    const { isOpen, onClose, onOpen } = useDisclosure();
    const { user } = useAuthContext();
    const [isHovered, setIsHovered] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();
    const [editComment, { isLoading: isEditing }] = useEditCommentMutation();

    const handleDelete = async () => {
        try {
            await deleteComment({
                cardId: card.id,
                id: comment.id,
            }).unwrap();
            toast({
                description: "Deleted comment!",
                status: "success",
            });
        } catch (e) {
            toast({
                description: "There was an error deleting the comment. Please try again.",
                status: "error",
            });
        }
    };

    const handleEdit = async (content: string) => {
        if (content === "") return;

        try {
            await editComment({
                id: comment.id,
                cardId: card.id,
                content,
            }).unwrap();
            toast({
                description: "Edited comment!",
                status: "success",
            });
        } catch (e) {
            toast({
                description: "There was an error editing the comment. Please try again.",
                status: "error",
            });
        }
    };

    const isLoading = isDeleting || isEditing;

    if (!user) return <></>;

    return (
        <Popover
            key={comment.id}
            returnFocusOnClose={false}
            isOpen={isOpen}
            onClose={onClose}
            initialFocusRef={initialFocusRef}
        >
            <Box
                w="full"
                minH="28"
                p="4"
                pos="relative"
                borderWidth="thin"
                borderRadius="md"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Text fontSize="lg">{comment.content}</Text>
                {isHovered && (
                    <IconButton
                        aria-label="Delete comment"
                        pos="absolute"
                        top="2"
                        right="2"
                        size="xs"
                        variant="ghost"
                        onClick={handleDelete}
                    >
                        {isLoading ? <Spinner /> : <FaTrash />}
                    </IconButton>
                )}
                <PopoverTrigger>
                    <Button
                        pos="absolute"
                        bottom="2"
                        right="2"
                        variant="ghost"
                        size="sm"
                        onClick={onOpen}
                    >
                        Edit
                    </Button>
                </PopoverTrigger>
            </Box>
            <PopoverContent p="2" borderWidth="medium" borderColor="gray.100">
                <PopoverArrow />
                <PopoverBody pt="8" pb="4">
                    <Input
                        ref={initialFocusRef}
                        onChange={(e: any) => setEditedContent(e.target.value)}
                        id="content"
                        placeholder="Edit comment...."
                    />
                </PopoverBody>
                <PopoverFooter gap="4" border="0" display="flex" justifyContent="end">
                    <ButtonGroup size="sm" isDisabled={isEditing}>
                        <IconButton aria-label="Cancel" variant="outline" onClick={onClose}>
                            {isEditing ? <Spinner /> : <FaTimes />}
                        </IconButton>
                        <IconButton
                            aria-label="Confirm edit"
                            variant="primary"
                            onClick={() => {
                                handleEdit(editedContent);
                                onClose();
                            }}
                        >
                            {isEditing ? <Spinner /> : <FaCheck />}
                        </IconButton>
                    </ButtonGroup>
                </PopoverFooter>
            </PopoverContent>
        </Popover>
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
                description: description === "" ? "No description" : description,
            }).unwrap();
            toast({
                description: "Added checklist!",
                status: "success",
            });
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

const ChecklistBuilder: React.FC<{ checklist: iChecklist }> = ({ checklist }) => {
    const toast = useToast();
    const [isHovered, setIsHovered] = useState(false);
    const [deleteChecklist, { isLoading: isDeleting }] = useDeleteChecklistMutation();
    // get the percentage of completed items
    const completedPercentage =
        checklist.items.length > 0
            ? Math.round(
                  (checklist.items.filter(i => i.checked).length / checklist.items.length) * 100
              )
            : 0;

    const handleDelete = async () => {
        try {
            await deleteChecklist({
                id: checklist.id,
            }).unwrap();
            toast({
                description: "Checklist deleted!",
                status: "success",
            });
        } catch (e) {
            console.warn(e);
            toast({
                description: "There was an error deleting the checklist.",
                status: "error",
            });
        }
    };

    return (
        <VStack
            w="full"
            px="2"
            mt="4"
            spacing="4"
            align="start"
            pos="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Text fontSize="lg">{checklist.name}</Text>
            <Text>{completedPercentage}% complete</Text>
            <Progress w="full" size="sm" value={completedPercentage} />
            <ChecklistItemBuilder checklist={checklist} />
            {isHovered && (
                <IconButton
                    aria-label="Delete checklist"
                    size="sm"
                    pos="absolute"
                    top="0"
                    right="2"
                    disabled={isDeleting}
                    onClick={handleDelete}
                >
                    <FaTrash />
                </IconButton>
            )}
        </VStack>
    );
};

const ChecklistItemDisplay: React.FC<{ item: iChecklistItem }> = ({ item }) => {
    const toast = useToast();
    const [toggleCheck] = useToggleChecklistItemMutation();

    const handleCheck = async () => {
        try {
            await toggleCheck({
                id: item.id,
            }).unwrap();
        } catch (e) {
            console.warn(e);
            toast({
                description: "There was an error toggling the checklist item.",
                status: "error",
            });
        }
    };

    return (
        <Checkbox key={item.id} defaultChecked={item.checked} onChange={(e: any) => handleCheck()}>
            <Text as={item.checked ? "s" : undefined}>{item.name}</Text>
        </Checkbox>
    );
};

const ChecklistItemBuilder: React.FC<{ checklist: iChecklist }> = ({ checklist }) => {
    const toast = useToast();
    const [addItem] = useAddChecklistItemMutation();
    const [name, setName] = useState("");
    const [isAddingMode, setIsAddingMode] = useState(false);
    const ref = useRef<HTMLInputElement>(null);

    const handleAdd = async () => {
        if (name === "") return;

        try {
            await addItem({
                checklistId: checklist.id,
                name,
            }).unwrap();
            toast({
                description: "Added checklist item!",
                status: "success",
            });
            ref.current?.blur();
            setIsAddingMode(false);
        } catch (e) {
            console.warn(e);
            toast({
                description: "There was an error adding the checklist item.",
                status: "error",
            });
        }
    };

    return (
        <>
            <VStack align="start" spacing="2">
                {checklist.items.map(item => (
                    <ChecklistItemDisplay item={item} />
                ))}
            </VStack>
            {isAddingMode && (
                <InputGroup>
                    <Input
                        ref={ref}
                        autoFocus
                        placeholder="Name"
                        onChange={(e: any) => setName(e.target.value)}
                    />
                    <InputRightElement>
                        <IconButton
                            aria-label="Add checklist item"
                            size="sm"
                            variant="primary"
                            onClick={handleAdd}
                        >
                            <FaCheck />
                        </IconButton>
                    </InputRightElement>
                </InputGroup>
            )}
            <HStack>
                {isAddingMode && (
                    <Button
                        size="sm"
                        onClick={() => {
                            ref.current?.blur();
                            setIsAddingMode(false);
                        }}
                    >
                        Cancel
                    </Button>
                )}
                {!isAddingMode && (
                    <Button size="sm" onClick={() => setIsAddingMode(!isAddingMode)}>
                        Add Item
                    </Button>
                )}
            </HStack>
        </>
    );
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

const TagBuilder: React.FC<{ card: iCard }> = ({ card }) => {
    const toast = useToast();
    const [createTag, { isLoading: isCreating }] = useCreateTagMutation();
    const [assignTags, { isLoading: isAssigning }] = useAssignTagsToCardMutation();
    const currentBoard = useAppSelector(state => state.boards.current);

    const isLoading = isCreating || isAssigning;

    if (!currentBoard) return <></>;

    const handleCreateTag = async (name: string) => {
        try {
            await createTag({ boardId: currentBoard.id, name }).unwrap();
        } catch (e) {
            console.warn(e);
            toast({
                description: "There was an error creating the tag.",
                status: "error",
            });
        }
    };

    console.log(card.tags);

    const handleAssignTags = async (tagIds: string[]) => {
        try {
            await assignTags({ cardId: card.id, tagIds }).unwrap();
        } catch (e) {
            console.warn(e);
            toast({
                description: "There was an error assigning the tags.",
                status: "error",
            });
        }
    };

    return (
        <Box mt="4">
            <CreatableSelect
                defaultValue={card.tags.map(tag => ({ value: tag.id, label: tag.name }))}
                isDisabled={isLoading}
                isClearable={false}
                size="md"
                options={currentBoard.tags.map(tag => ({
                    value: tag.id,
                    label: tag.name,
                }))}
                isMulti
                backspaceRemovesValue={false}
                onCreateOption={handleCreateTag}
                onChange={values => handleAssignTags(values.map(v => v.value))}
            />
        </Box>
    );
};
