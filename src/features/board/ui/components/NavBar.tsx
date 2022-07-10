import { FaUser } from "react-icons/fa";

import {
    Avatar, Box, Button, Flex, Heading, HStack, Spacer, Text, useDisclosure
} from "@chakra-ui/react";

import { openDrawer } from "../../../../app/slices/ui/drawers";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";


export const NavBar: React.FC = () => {
	const dispatch = useAppDispatch();

	return (
		<Box pos="static" top={0} px={6} py={4} bgColor="white">
			<Flex>
				<HStack>
					<Button
						bgColor="white"
						_hover={{ bgColor: "gray.100" }}
						leftIcon={<FaUser />}
						onClick={() => dispatch(openDrawer("main"))}
					>
						Profile
					</Button>
				</HStack>
			</Flex>
		</Box>
	);
};
