import { Field, Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { FaBars, FaBox, FaCog, FaCogs, FaFolderPlus, FaHamburger } from "react-icons/fa";
import * as Yup from "yup";

import {
    Box, Button, Center, Flex, FormControl, FormErrorMessage, FormLabel, Heading, HStack,
    IconButton, Input, Spacer, Spinner, Text, Tooltip, useToast, VStack
} from "@chakra-ui/react";

import { useMoveCardMutation } from "../../../app/services/cards";
import {
    useAddFolderMutation, useGetBoardFoldersQuery, useLazyGetBoardFoldersQuery,
    useMoveFolderMutation
} from "../../../app/services/folder";
import { openModal } from "../../../app/slices/ui/modals";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { StrictModeDroppable } from "../../../utils/StrictModeDroppable";
import { EditBoardModal } from "./components/EditBoardModal";
import { EditCardModal } from "./components/EditCardModal";
import { EditFolderModal } from "./components/EditFolderModal";
import { Folder } from "./components/Folder";

const AddBoardPage: React.FC<{}> = () => {
    const dispatch = useAppDispatch();

    return (
        <Center w="full">
            <VStack spacing="6">
                <Heading>Create a new board</Heading>
                <Button variant="primary" onClick={() => dispatch(openModal("addBoard"))}>
                    Create
                </Button>
            </VStack>
        </Center>
    );
};

export const BoardPage: React.FC<{}> = props => {
    const toast = useToast();
    const dispatch = useAppDispatch();
    const currentBoard = useAppSelector(state => state.boards.current)!;
    const [isAddingFolderMode, setIsAddingFolderMode] = useState(false);
    const [getBoardFolders, { data: folders }] = useLazyGetBoardFoldersQuery();
    const [moveCard] = useMoveCardMutation();
    const [moveFolder] = useMoveFolderMutation();
    const [addFolder] = useAddFolderMutation();

    useEffect(() => {
        if (!currentBoard) return;
        document.title = `${currentBoard.name} | Flow`;
    }, [currentBoard]);

    useEffect(() => {
        if (!currentBoard) return;
        getBoardFolders(currentBoard.id);
    }, [currentBoard]);

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
            toast({
                description: `'${folderName}' created!`,
                status: "success",
            });
        } catch (e) {
            console.log(e);
            toast({
                description: "Could not add folder. Please try again.",
                status: "error",
            });
        }
    };

    if (!currentBoard) return <AddBoardPage />;

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
                    <IconButton
                        aria-label="Board Settings"
                        size="lg"
                        onClick={() => dispatch(openModal("editBoard"))}
                    >
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
                                        <Formik
                                            validationSchema={AddFolderSchema}
                                            onSubmit={({ name }) => handleAddFolder(name)}
                                            initialValues={{
                                                name: "New Folder",
                                            }}
                                        >
                                            {({ values, errors, touched, getFieldProps }) => (
                                                <Form>
                                                    <Field name="name">
                                                        {(props: any) => (
                                                            <FormControl
                                                                isInvalid={
                                                                    !!errors.name && touched.name
                                                                }
                                                            >
                                                                <Input
                                                                    {...getFieldProps("name")}
                                                                    id={"name"}
                                                                    placeholder="e.g. johndoe@gmail.com"
                                                                    bgColor="white"
                                                                />
                                                                <FormErrorMessage>
                                                                    {errors.name}
                                                                </FormErrorMessage>
                                                            </FormControl>
                                                        )}
                                                    </Field>
                                                </Form>
                                            )}
                                        </Formik>
                                    )}
                                    <Button
                                        w="full"
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
            <EditBoardModal />
        </DragDropContext>
    );
};

const AddFolderSchema = Yup.object().shape({
    name: Yup.string().required("Folder name cannot be empty!"),
});
