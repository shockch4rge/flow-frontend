import "./assets/styles/index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import { ChakraProvider } from "@chakra-ui/react";

import App from "./App";
import store from "./app/store";
import theme from "./utils/theme";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Provider store={store}>
			<ChakraProvider theme={theme}>
				<Router>
					<App />
				</Router>
			</ChakraProvider>
		</Provider>
	</React.StrictMode>
);
