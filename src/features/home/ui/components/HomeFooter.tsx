import { FaGithub } from "react-icons/fa";

import { Box, Center, Flex, IconButton, Text } from "@chakra-ui/react";


export const HomeFooter: React.FC = () => {
	return (
		<Center bg="gray.700" h="64" w="full">
			<Flex>
				<IconButton aria-label="GitHub repository" textColor="gray.500" bg="gray.600">
					<FaGithub size="24" />
				</IconButton>
			</Flex>
		</Center>
	);
};
