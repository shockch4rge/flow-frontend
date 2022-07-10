import { FaArrowRight } from "react-icons/fa";

import {
    Box, Button, ButtonGroup, Center, Container, Flex, Heading, HStack, Image, Spacer, VStack
} from "@chakra-ui/react";

import { openModal } from "../../../app/slices/ui/modals";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { HomeFooter } from "./components/HomeFooter";
import { HomeNavBar } from "./components/HomeNavBar";
import { LoginModal } from "./components/LoginModal";


export const HomePage: React.FC = () => {
	const dispatch = useAppDispatch();

	return (
		<>
			<VStack h="100vh">
				<HomeNavBar />
				<Flex maxW="6xl" flex={1} align="center">
					<HStack spacing="12">
						<VStack spacing="10" align="start">
							<Heading size="2xl">Embrace productivity.</Heading>
							<Button
								w="48"
								variant="ghost"
								size="lg"
								rightIcon={<FaArrowRight />}
								onClick={() => dispatch(openModal("login"))}
							>
								Get started
							</Button>
						</VStack>
						<Image boxSize="2xl" src="/src/assets/images/home-hero.svg" />
					</HStack>
				</Flex>
			</VStack>
			<HomeFooter />
			<LoginModal />
		</>
	);
};
