import { HTMLAttributes, useState } from "react";
import { FaEdit, FaPen, FaPencilAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";

import { Box, Text } from "@chakra-ui/react";

import { openModal, setEditCardTarget } from "../../../../app/slices/ui/modals";
import { iCard } from "../../../../utils/models";


interface Props {
	card: iCard;
}

export const Card: React.FC<Props> = props => {
	const dispatch = useDispatch();

	const { card } = props;
	const [isHovered, setIsHovered] = useState(false);

	return (
		<>
			<Box
				p="4"
				bgColor="white"
				pos="relative"
				borderRadius={4}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				{isHovered && (
					<Box
						w="100%"
						pos="absolute"
						top="3"
						left="52"
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
			</Box>
		</>
	);
};
