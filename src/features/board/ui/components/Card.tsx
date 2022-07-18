import { useMemo, useState } from "react";
import { FaClock, FaPen, FaRegSquare, FaSquare } from "react-icons/fa";
import { useDispatch } from "react-redux";

import { Box, Button, Text } from "@chakra-ui/react";

import { openModal, setEditCardTarget } from "../../../../app/slices/ui/modals";
import { iCard } from "../../../../utils/models";


interface Props {
	card: iCard;
}

export const Card: React.FC<Props> = props => {
	const { card } = props;
	const dispatch = useDispatch();
	const [isHovered, setIsHovered] = useState(false);

	const memoizedCard = useMemo(
		() => (
			<Box
				p="4"
				bgColor="white"
				pos="relative"
				_hover={{ bgColor: "gray.50" }}
				transition="all 0.2s ease-in-out"
				borderRadius={4}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				{isHovered && (
					<Box
						w="100%"
						pos="absolute"
						top="3"
						left="56"
						alignSelf="end"
						cursor="pointer"
						_hover={{ textColor: "black" }}
						onClick={() => {
							dispatch(setEditCardTarget(card));
							dispatch(openModal("editCard"));
						}}
					>
						<FaPen size={14} opacity="30%" />
					</Box>
				)}
				<Text>{card.name}</Text>
				<DueDateButton />
			</Box>
		),
		[card, isHovered]
	);

	return memoizedCard;
};

const DueDateButton: React.FC = () => {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<Button
			mt="4"
			size="sm"
			variant="dueDateLate"
			leftIcon={isHovered ? <FaRegSquare size="18" /> : <FaClock size="18" />}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onClick={() => {}}
		>
			Jan 25
		</Button>
	);
};
