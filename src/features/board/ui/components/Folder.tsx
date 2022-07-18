import { useMemo, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { FaPlusSquare } from "react-icons/fa";

import {
    Box, Button, Center, Editable, EditableInput, EditablePreview, Flex, Input, SlideFade, Spinner,
    Text, VStack, Wrap, WrapItem
} from "@chakra-ui/react";

import { useAddCardMutation, useGetFolderCardsQuery } from "../../../../app/services/cards";
import { toast } from "../../../../app/slices/ui/toast";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { iCard, iFolder } from "../../../../utils/models";
import { StrictModeDroppable } from "../../../../utils/StrictModeDroppable";
import { Card } from "./Card";


interface Props {
	folder: iFolder;
}

export const Folder: React.FC<Props> = props => {
	const { folder } = props;
	const dispatch = useAppDispatch();

	const { data: cards, isLoading: isLoadingCards } = useGetFolderCardsQuery(folder.id);
	const [addCard, { isLoading: isAddingCard }] = useAddCardMutation();
	const [isAddingCardMode, setIsAddingCardMode] = useState(false);

	const handleAddCard = async (cardName: string) => {
		if (cardName.length === 0) {
			setIsAddingCardMode(false);
			return;
		}

		setIsAddingCardMode(false);

		await addCard({
			name: cardName,
			folderId: folder.id,
		});
		dispatch(
			toast({
				content: `'${cardName}' added!`,
			})
		);
	};

	const memoizedFolder = useMemo(() => {
		return (
			<Box w="72" p="2" bgColor="gray.200" borderRadius="6">
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
								{/* the reason we don't use a VStack here is because chakra applies the top margin to every element,
								even while dragging. This causes the placeholder to be offsetted by the top margin of the
								first element. */}
								<Flex
									mt="4"
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
									overflowY="auto"
									overflowX="hidden"
									sx={{
										scrollbarGutter: "auto",
									}}
								>
									{cards?.map((card, index) => (
										<Draggable key={card.id} draggableId={card.id} index={index}>
											{({ innerRef, draggableProps, dragHandleProps }) => (
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
											mt="3"
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
	}, [cards, isAddingCardMode]);

	return memoizedFolder;
};
