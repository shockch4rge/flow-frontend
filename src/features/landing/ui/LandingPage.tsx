import { FaArrowRight } from "react-icons/fa";

import { Button, Flex, Heading, HStack, Image, Stack, VStack } from "@chakra-ui/react";

import { openModal } from "../../../app/slices/ui/modals";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { HomeFooter } from "./components/LandingFooter";
import { LandingNavBar } from "./components/LandingNavBar";
import { LoginModal } from "./components/LoginModal";
import { ResetPasswordModal } from "./components/ResetPasswordModal";
import { SignupModal } from "./components/SignupModal";


export const LandingPage: React.FC = () => {
	const dispatch = useAppDispatch();

	return (
		<>
			<VStack h="100vh" overflow={["hidden", "hidden", "visible"]}>
				<LandingNavBar />
				<Flex maxW="6xl" flex={1} align="center">
					<Stack direction={["column", "column", "column", "row"]} align="center">
						<VStack mt={["12"]} mx="4" spacing="6" align={["center", "center", "center", "start"]}>
							<Heading
								size={["3xl", "3xl", "2xl", "2xl"]}
								textAlign={["center", "center", "unset", "unset"]}
							>
								Embrace productivity.
							</Heading>
							<Button
								w="48"
								variant="primaryGhost"
								size="lg"
								rightIcon={<FaArrowRight />}
								onClick={() => dispatch(openModal("login"))}
							>
								Get started
							</Button>
						</VStack>
						<Image
							p={["4"]}
							boxSize={["sm", "md", "md", "xl"]}
							src="/src/assets/images/home-hero.svg"
						/>
					</Stack>
				</Flex>
			</VStack>
			<HomeFooter />
			<LoginModal />
			<SignupModal />
			<ResetPasswordModal />
		</>
	);
};
