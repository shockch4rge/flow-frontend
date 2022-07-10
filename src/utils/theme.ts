import {
    ComponentStyleConfig, extendTheme, theme as baseTheme, ThemeConfig, ThemeTypings
} from "@chakra-ui/react";
import { StyleFunctionProps } from "@chakra-ui/theme-tools";


const extendedTheme = {
	colors: {
		main: {
			400: "#00B78C",
		},
	},
	components: {
		Button: {
			variants: {
				ghost: (props: StyleFunctionProps) => ({
					bg: "transparent",
					fontWeight: "light",
					textColor: "green.400",
					_hover: {
						bg: "green.300",
						textColor: "white",
					},
					_active: {
						bg: "green.400",
						// textColor: "green.700",
					},
				}),
			},
		},
	} as ComponentStyleConfig,
	fonts: {
		body: "Lexend",
		heading: "Lexend",
		monospace: "Menlo, monospace",
	},
};

const theme = extendTheme(extendedTheme, baseTheme);

export default theme;
