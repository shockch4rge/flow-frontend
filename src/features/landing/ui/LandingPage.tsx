import { FaArrowRight } from "react-icons/fa";

import {
    Button, Flex, Heading, Highlight, HStack, Image, Stack, Text, VStack
} from "@chakra-ui/react";

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
								fontWeight="black"
							>
								<Highlight query="Embrace" styles={{ textColor: "green.300" }}>
									Embrace productivity.
								</Highlight>
							</Heading>
							<Text
								fontSize={["lg", "lg", "xl"]}
								textAlign={["center", "center", "start", "start"]}
							>
								Flow is a{" "}
								<Highlight
									query={["simple,", "powerful"]}
									styles={{
										p: "1",
										borderRadius: "4",
										bgColor: "green.100",
										fontWeight: "bold",
									}}
								>
									simple, yet powerful tool to manage your daily tasks and workflows.
								</Highlight>
							</Text>
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
