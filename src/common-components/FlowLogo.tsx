import { Heading, HStack, Image } from "@chakra-ui/react";


interface Props {
	size: number;
}

export const FlowLogo: React.FC<Props> = props => {
	return (
		<HStack>
			<Image
				boxSize={`${props.size}px`}
				src="/src/assets/flow-logo.svg"
				alt="Flow logo"
				userSelect="none"
			/>
			<Heading userSelect="none" fontFamily="Lexend">
				Flow
			</Heading>
		</HStack>
	);
};
