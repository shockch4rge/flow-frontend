import {
    ComponentStyleConfig, extendTheme, theme as baseTheme, ThemeConfig
} from "@chakra-ui/react";
import { StyleFunctionProps } from "@chakra-ui/theme-tools";

const config: ThemeConfig = {
	useSystemColorMode: false,
	initialColorMode: "light",
};

const extendedTheme = {
	colors: {
		main: {
			400: "#00B78C",
		},
	},
	components: {
		Button: {
			variants: {
				primaryGhost: (props: StyleFunctionProps) => ({
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

				primary: (props: StyleFunctionProps) => ({
					bg: "green.300",
					fontWeight: "light",
					textColor: "white",
					_hover: {
						bg: "green.400",
						textColor: "white",
						_disabled: {
							bg: "green.300",
							fontWeight: "light",
							textColor: "white",
						},
					},
					_active: {
						bg: "green.400",
					},
					_disabled: {
						bg: "green.300",
						fontWeight: "light",
						textColor: "white",
					},
				}),

				secondary: (props: StyleFunctionProps) => ({}),

				secondaryGhost: (props: StyleFunctionProps) => ({
					bg: "transparent",
					fontWeight: "light",
					textColor: "gray.400",
					_hover: {
						bg: "gray.200",
						textColor: "gray.500",
					},
					_active: {
						bg: "gray.300",
					},
				}),

				dueDate: (props: StyleFunctionProps) => ({}),

				dueDateLate: (props: StyleFunctionProps) => ({
					bg: "red.100",
					fontWeight: "medium",
					textColor: "red.400",
					_hover: {
						bg: "red.200",
						textColor: "red.500",
					},
					_active: {
						bg: "red.300",
					},
				}),

				sidebar: (props: StyleFunctionProps) => ({
					bg: "#44546e",
					fontWeight: "medium",
					textColor: "green.300",
					_hover: {
						bg: "gray.500",
					},
				}),
			},
		},
	} as ComponentStyleConfig,
	fonts: {
		body: "Karla",
		heading: "Karla",
		monospace: "Menlo, monospace",
	},
};

const theme = extendTheme(extendedTheme, config);

export default theme;
