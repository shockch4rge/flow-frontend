import { Heading, HStack, Image } from "@chakra-ui/react";

interface Props {
	size: number;
	variant?: "logo" | "text" | "full";
	color?: "dark" | "light";
}

export const FlowLogo: React.FC<Props> = ({ size, variant, color }) => {
	const logo = (
		<Image
			boxSize={`${size}px`}
			src="/src/assets/flow-logo.svg"
			alt="Flow logo"
			userSelect="none"
		/>
	);

	const text = (
		<Heading
			userSelect="none"
			fontFamily="Lexend"
			textColor={color === "dark" ? "black" : "white"}
		>
			Flow
		</Heading>
	);

	if (variant === "logo") {
		return logo;
	}

	if (variant === "text") {
		return text;
	}

	return (
		<HStack>
			<Image
				boxSize={`${size}px`}
				src="/src/assets/flow-logo.svg"
				alt="Flow logo"
				userSelect="none"
			/>
			<Heading
				userSelect="none"
				fontFamily="Lexend"
				textColor={color === "dark" ? "black" : "white"}
			>
				Flow
			</Heading>
		</HStack>
	);
};
