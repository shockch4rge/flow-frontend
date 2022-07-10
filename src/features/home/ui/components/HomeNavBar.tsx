import { FaUser } from "react-icons/fa";

import {
    Avatar, Box, Button, Flex, Heading, HStack, Image, Spacer, Text, useDisclosure
} from "@chakra-ui/react";

import { openDrawer } from "../../../../app/slices/ui/drawers";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";


export const HomeNavBar: React.FC = () => {
	const dispatch = useAppDispatch();

	return (
		<Flex pos="sticky" top={0} w="full" px={6} py={4} bgColor="white" direction="row">
			<HStack>
				<Image boxSize="50px" src="/src/assets/flow-logo.svg" alt="Dan Abramov" userSelect="none" />
				<Heading userSelect="none">Flow</Heading>
			</HStack>
			<Spacer />
			<HStack>
				<Button
					variant="solid"
					bgColor="green.100"
					textColor="green.400"
					_hover={{ bgColor: "green.200", textColor: "green.500" }}
					_active={{ bgColor: "green.300", textColor: "green.600" }}
					onClick={() => {}}
				>
					Login
				</Button>
				<Button
					variant="outline"
					bgColor="white"
					_hover={{ bgColor: "green.200", textColor: "green.500" }}
					_active={{ bgColor: "green.300", textColor: "green.600" }}
					onClick={() => {}}
				>
					Sign up
				</Button>
			</HStack>
		</Flex>
	);
};
