import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { FaPlus, FaPlusSquare, FaTimes } from "react-icons/fa";

import {
    Box, Button, Editable, EditableInput, EditablePreview, Flex, IconButton, Input, InputGroup,
    Text, Tooltip, VStack
} from "@chakra-ui/react";

import { iCard, iFolder } from "../../../../utils/models";
import { StrictModeDroppable } from "../../../../utils/StrictModeDroppable";
import { Card } from "./Card";


const _cards: iCard[] = [
	{
		id: "card1",
		folderId: "folder1",
		name: "Doing something",
		description: "This is card1",
		components: [],
	},
	{
		id: "card2",
		folderId: "folder2",
		name: "Doing something else",
		description: "This is card2",
		components: [],
	},
];

let id = 3;

interface Props {
	folder: iFolder;
}

export const Folder: React.FC<Props> = props => {
	const { folder } = props;
	const [isAddingCard, setIsAddingCard] = useState(false);
	const [cards, setCards] = useState(_cards);

	const handleAddCard = (cardName: string) => {
		if (cardName.length === 0) {
			setIsAddingCard(false);
			return;
		}

		cards.push({
			id: `card${id++}`,
			folderId: "folder2",
			name: cardName,
			description: "This is card2",
			components: [],
		});

		setIsAddingCard(false);
	};

	return (
		<DragDropContext
			onDragEnd={result => {
				if (!result.destination) return;

				const items = Array.from(cards);
				const [reorderedItem] = items.splice(result.source.index, 1);
				items.splice(result.destination.index, 0, reorderedItem);

				setCards(items);
			}}
		>
			<Box w="64" p="3" bgColor="gray.200" borderRadius={6}>
				<Text mb="4" fontWeight="semibold">
					{folder.name}
				</Text>
				<StrictModeDroppable
					droppableId={folder.id}
					renderClone={(provided, snap, rubric) => (
						<Box
							w="100%"
							ref={provided.innerRef}
							{...provided.draggableProps}
							{...provided.dragHandleProps}
						>
							<Card card={cards[rubric.source.index]} />
						</Box>
					)}
				>
					{(provided, snap) => (
						<VStack
							spacing={3}
							justify="center"
							ref={provided.innerRef}
							{...provided.droppableProps}
						>
							{cards.map((card, index) => (
								<Draggable key={card.id} draggableId={card.id} index={index}>
									{(provided, snap) => (
										<Box
											w="100%"
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
										>
											<Card card={card} />
										</Box>
									)}
								</Draggable>
							))}
							{provided.placeholder}
							{isAddingCard && (
								<Editable
									w="100%"
									defaultValue="New card"
									isPreviewFocusable
									selectAllOnFocus
									startWithEditView
									onSubmit={handleAddCard}
								>
									<EditablePreview w="100%" py={2} px={2} bg="gray.50" />
									<Input py={2} px={4} as={EditableInput} />
								</Editable>
							)}

							<Button
								w="100%"
								bg="transparent"
								_hover={{ bg: "gray.100" }}
								_active={{ bg: "gray.50" }}
								leftIcon={<FaPlusSquare />}
								textColor="gray.400"
								fontWeight="light"
								onClick={() => setIsAddingCard(true)}
							>
								Add Card
							</Button>
						</VStack>
					)}
				</StrictModeDroppable>
			</Box>
		</DragDropContext>
	);
};
