import { useCallback, useMemo, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { FaPen, FaPlusSquare } from "react-icons/fa";

import {
    Box, Button, Center, Editable, EditableInput, EditablePreview, Flex, Input, SlideFade, Spinner,
    Text, useBoolean, useToast
} from "@chakra-ui/react";

import { useAddCardMutation, useGetFolderCardsQuery } from "../../../../app/services/cards";
import { openModal, setEditFolderTarget } from "../../../../app/slices/ui/modals";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { iCard, iFolder } from "../../../../utils/models";
import { StrictModeDroppable } from "../../../../utils/StrictModeDroppable";
import { Card } from "./Card";

interface Props {
    folder: iFolder;
    toggleSelection: (cardId: string) => void;
    toggleSelectionInGroup: (cardId: string) => void;
    multiSelectTo: (cardId: string) => void;
}

export const Folder: React.FC<Props> = props => {
    const { folder } = props;
    const toast = useToast();
    const dispatch = useAppDispatch();

    const { data: cards, isLoading: isLoadingCards } = useGetFolderCardsQuery(folder.id);
    const [addCard, { isLoading: isAddingCard }] = useAddCardMutation();
    const [isHovered, { on: onHover, off: offHover }] = useBoolean(false);
    const [isAddingCardMode, setIsAddingCardMode] = useState(false);

    const handleAddCard = async (cardName: string) => {
        if (cardName.length === 0) {
            setIsAddingCardMode(false);
            return;
        }

        setIsAddingCardMode(false);

        try {
            await addCard({
                name: cardName,
                folderId: folder.id,
            }).unwrap();
            toast({
                description: `'${cardName}' added!`,
                status: "success",
            });
        } catch (e) {
            toast({
                description: "There was an error adding a card. Please try again.",
                status: "error",
            });
        }
    };

    const performAction = useCallback(
        (
            e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
            card: iCard
        ) => {
            const { toggleSelection, toggleSelectionInGroup, multiSelectTo } = props;

            if (wasToggleInSelectionGroupKeyUsed(e)) {
                toggleSelectionInGroup(card.id);
                return;
            }

            if (wasMultiSelectKeyUsed(e)) {
                multiSelectTo(card.id);
                return;
            }

            toggleSelection(card.id);
        },
        []
    );

    const wasToggleInSelectionGroupKeyUsed = (
        e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>
    ) => {
        // though deprecated, navigator.platform is the only native way to detect the platform
        const isUsingWindows = navigator.platform.indexOf("Win") >= 0;
        return isUsingWindows ? e.ctrlKey : e.metaKey;
    };

    const wasMultiSelectKeyUsed = (
        e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>
    ) => e.shiftKey;

    const memoizedFolder = useMemo(() => {
        return (
            <Box
                w="72"
                p="2"
                bgColor="gray.200"
                borderRadius="6"
                pos="relative"
                onMouseEnter={onHover}
                onMouseLeave={offHover}
            >
                {isHovered && (
                    <Box
                        w="full"
                        pos="absolute"
                        left="64"
                        top="4"
                        onClick={() => {
                            dispatch(setEditFolderTarget(folder));
                            dispatch(openModal("editFolder"));
                        }}
                    >
                        <FaPen opacity="30%" />
                    </Box>
                )}
                <Text alignSelf="start" fontWeight="semibold" mt="2" ml="2">
                    {folder.name}
                </Text>

                {isLoadingCards ? (
                    <Center>
                        <Spinner size="xl" my="6" />
                    </Center>
                ) : (
                    <StrictModeDroppable droppableId={folder.id}>
                        {({ innerRef, droppableProps, placeholder }, snap) => (
                            <>
                                {/* the reason we don't use a VStack here is because chakra applies a top margin to the dragged element. 
								This causes the placeholder to be offsetted by the top margin of the first element. */}
                                <Flex
                                    mt="2"
                                    p="2"
                                    pb="-2"
                                    ref={innerRef}
                                    {...droppableProps}
                                    minH="42"
                                    maxH="md"
                                    borderRadius="6"
                                    flexDirection="column"
                                    bgColor={snap.isDraggingOver ? "gray.100" : "gray.200"}
                                    transition="background-color 0.2s ease-in-out"
                                    overflowY="scroll"
                                    overflowX="hidden"
                                    sx={{
                                        scrollbarColor: "gray.500 gray.600",
                                    }}
                                >
                                    {cards?.length === 0 && (
                                        <Text
                                            textAlign="center"
                                            fontWeight="bold"
                                            fontSize="md"
                                            textColor="gray.400"
                                            my="6"
                                        >
                                            No cards in this folder.
                                        </Text>
                                    )}
                                    {cards?.map((card, index) => (
                                        <Draggable
                                            key={card.id}
                                            draggableId={card.id}
                                            index={index}
                                        >
                                            {(
                                                { innerRef, draggableProps, dragHandleProps },
                                                draggableSnapshot
                                            ) => (
                                                <SlideFade
                                                    in={!isLoadingCards}
                                                    offsetY="20px"
                                                    delay={{ enter: index / 25, exit: 1 }}
                                                >
                                                    <Box
                                                        w="100%"
                                                        mb="2"
                                                        ref={innerRef}
                                                        {...draggableProps}
                                                        {...dragHandleProps}
                                                        onClick={(e: any) => {
                                                            if (e.defaultPrevented) return;
                                                            if (e.button !== 0) return;

                                                            e.preventDefault();
                                                            performAction(e, card);
                                                        }}
                                                        onKeyDown={(e: any) => {
                                                            if (e.defaultPrevented) return;
                                                            if (e.key !== "Enter") return;
                                                            if (draggableSnapshot.isDragging)
                                                                return;

                                                            e.preventDefault();
                                                            performAction(e, card);
                                                        }}
                                                    >
                                                        <Card card={card} />
                                                    </Box>
                                                </SlideFade>
                                            )}
                                        </Draggable>
                                    ))}
                                    {placeholder}
                                    {isAddingCardMode && (
                                        <Editable
                                            w="100%"
                                            my="2"
                                            defaultValue="New card"
                                            selectAllOnFocus
                                            startWithEditView
                                            submitOnBlur
                                            onSubmit={handleAddCard}
                                        >
                                            <EditablePreview w="100%" p="2" bg="gray.50" />
                                            <Input py={2} px={4} as={EditableInput} />
                                        </Editable>
                                    )}
                                    {isAddingCard && <Spinner alignSelf="center" my="2" />}
                                </Flex>
                                <Button
                                    mt="2"
                                    w="100%"
                                    bg="transparent"
                                    _hover={snap.isDraggingOver ? undefined : { bg: "gray.100" }}
                                    _active={{ bg: "gray.50" }}
                                    leftIcon={<FaPlusSquare />}
                                    textColor="gray.400"
                                    fontWeight="light"
                                    onClick={() => setIsAddingCardMode(true)}
                                >
                                    Add Card
                                </Button>
                            </>
                        )}
                    </StrictModeDroppable>
                )}
            </Box>
        );
    }, [cards, isAddingCardMode, isHovered]);

    return memoizedFolder;
};
