import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { FaPlus, FaPlusSquare, FaTimes } from "react-icons/fa";

import {
    Box, Button, Editable, EditableInput, EditablePreview, Flex, IconButton, Input, InputGroup,
    Text, Tooltip, VStack
} from "@chakra-ui/react";

import { useGetFolderCardsQuery } from "../../../../app/services/cards";
import { useAddFolderMutation } from "../../../../app/services/folder";
import { iCard, iFolder } from "../../../../utils/models";
import { StrictModeDroppable } from "../../../../utils/StrictModeDroppable";
import { Card } from "./Card";


interface Props {
	folder: iFolder;
}

export const Folder: React.FC<Props> = props => {
	const { folder } = props;
	const { data: cards } = useGetFolderCardsQuery(folder.id);
	const [isAddingCard, setIsAddingCard] = useState(false);

	const handleAddCard = (cardName: string) => {
		if (cardName.length === 0) {
			setIsAddingCard(false);
			return;
		}

		setIsAddingCard(false);
	};

	return (
		<Box w="64" p="3" bgColor="gray.200" borderRadius="6">
			<Text alignSelf="start" fontWeight="semibold">
				{folder.name}
			</Text>
			<Droppable droppableId={folder.id}>
				{({ innerRef, droppableProps, placeholder: clone }, snap) => (
					<Box ref={innerRef} {...droppableProps} mt="4">
						{cards?.map((card, index) => (
							<Draggable key={card.id} draggableId={card.id} index={index}>
								{({ innerRef, draggableProps, dragHandleProps }) => (
									<Box
										w="100%"
										mb="2"
										ref={innerRef}
										{...draggableProps}
										{...dragHandleProps}
									>
										<Card card={card} />
									</Box>
								)}
							</Draggable>
						))}
						{clone}
						{isAddingCard && (
							<Editable
								w="100%"
								defaultValue="New card"
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
					</Box>
				)}
			</Droppable>
		</Box>
	);
};
