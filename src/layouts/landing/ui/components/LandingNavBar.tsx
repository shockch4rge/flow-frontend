import { FaBars, FaUser } from "react-icons/fa";

import {
    Avatar, Box, Button, Flex, Heading, Hide, HStack, IconButton, Image, Menu, MenuButton, MenuItem,
    MenuList, Show, Spacer, Text, useDisclosure
} from "@chakra-ui/react";

import { openDrawer } from "../../../../app/slices/ui/drawers";
import { openModal } from "../../../../app/slices/ui/modals";
import { FlowLogo } from "../../../../common-components";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";


export const LandingNavBar: React.FC = () => {
	const dispatch = useAppDispatch();

	return (
		<Flex
			pos="sticky"
			top={0}
			w="full"
			px={6}
			py={4}
			bgColor="white"
			backdropBlur="8px"
			backdropFilter="auto"
			direction="row"
		>
			<FlowLogo size={50} />
			<Spacer />
			<Hide below="md">
				<HStack>
					<Button variant="primary" onClick={() => dispatch(openModal("login"))}>
						Login
					</Button>
					<Button variant="secondaryGhost" onClick={() => dispatch(openModal("signup"))}>
						Sign Up
					</Button>
				</HStack>
			</Hide>
			<Hide above="md">
				<Menu>
					<MenuButton
						as={IconButton}
						aria-label="More Options"
						icon={<FaBars size="20" />}
						variant="ghost"
						size="lg"
					/>
					<MenuList p="2">
						<MenuItem borderRadius="6">Login</MenuItem>
						<MenuItem borderRadius="6">Sign Up</MenuItem>
					</MenuList>
				</Menu>
			</Hide>
		</Flex>
	);
};
