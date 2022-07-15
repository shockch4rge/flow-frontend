import { Field, Form, Formik } from "formik";
import { useCallback, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import * as Yup from "yup";

import {
    Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Hide, HStack, IconButton,
    Image, Input, InputGroup, InputRightElement, Link, Modal, ModalBody, ModalCloseButton,
    ModalContent, ModalHeader, ModalOverlay, Text, Tooltip, VStack
} from "@chakra-ui/react";

import { closeModal, openModal } from "../../../../app/slices/ui/modals";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../hooks/useAppSelector";


const nameFieldName = "name";
const usernameFieldName = "username";
const emailFieldName = "email";
const passwordFieldName = "password";

export const SignupModal: React.FC = () => {
	const dispatch = useAppDispatch();
	const { open } = useAppSelector(state => state.ui.modals.signup);
	const [showPassword, setShowPassword] = useState(false);

	const close = useCallback(() => dispatch(closeModal("signup")), []);

	return (
		<Modal size={["xs", "md", "lg", "xl"]} isOpen={open} onClose={close} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>
					<Flex justify="center">
						<HStack align="center">
							<Image boxSize="50px" src="/src/assets/flow-logo.svg" alt="logo" />
							<Heading>Flow</Heading>
						</HStack>
					</Flex>
				</ModalHeader>
				<ModalCloseButton />
				<Formik
					validationSchema={SignupSchema}
					initialValues={{
						name: "",
						username: "",
						email: "",
						password: "",
					}}
					onSubmit={() => {}}
				>
					{({ errors, touched, validateForm, isSubmitting, isValid, dirty, getFieldProps }) => (
						<ModalBody>
							<Heading textAlign="center" size="lg">
								Create <Hide below="md">a free</Hide> account
							</Heading>
							<Form>
								<VStack mt="4" spacing="6" justify="center">
									<Field name={nameFieldName}>
										{(props: any) => (
											<FormControl isInvalid={!!errors.name && touched.name}>
												<FormLabel htmlFor={nameFieldName}>Name</FormLabel>
												<Input
													{...getFieldProps(nameFieldName)}
													id={nameFieldName}
													placeholder="e.g. John Doe"
												/>
												<FormErrorMessage>{errors.name}</FormErrorMessage>
											</FormControl>
										)}
									</Field>
									<Field name={usernameFieldName}>
										{(props: any) => (
											<FormControl isInvalid={!!errors.username && touched.username}>
												<FormLabel htmlFor={usernameFieldName}>Username</FormLabel>
												<Input
													{...getFieldProps(usernameFieldName)}
													id={usernameFieldName}
													placeholder="e.g. JohnDoe123"
												/>
												<FormErrorMessage>{errors.username}</FormErrorMessage>
											</FormControl>
										)}
									</Field>
									<Field name={emailFieldName}>
										{(props: any) => (
											<FormControl isInvalid={!!errors.email && touched.email}>
												<FormLabel htmlFor={emailFieldName}>Email</FormLabel>
												<Input
													{...getFieldProps(emailFieldName)}
													id={emailFieldName}
													placeholder="e.g. johndoe@gmail.com"
												/>
												<FormErrorMessage>{errors.email}</FormErrorMessage>
											</FormControl>
										)}
									</Field>
									<Field name={passwordFieldName}>
										{(props: any) => (
											<FormControl isInvalid={!!errors.password && touched.password}>
												<FormLabel htmlFor={passwordFieldName}>Password</FormLabel>
												<InputGroup>
													<Input
														{...getFieldProps(passwordFieldName)}
														id={passwordFieldName}
														type={showPassword ? "text" : "password"}
														placeholder="Password"
													/>
													<Tooltip
														label="Toggle Visibility"
														openDelay={1000}
														hasArrow
													>
														<InputRightElement
															cursor={showPassword ? "pointer" : "default"}
															onClick={() => setShowPassword(!showPassword)}
														>
															<IconButton
																size="sm"
																bg="transparent"
																aria-label="Toggle password visibility"
															>
																{showPassword ? (
																	<FaEye size="20" />
																) : (
																	<FaEyeSlash size="20" />
																)}
															</IconButton>
														</InputRightElement>
													</Tooltip>
												</InputGroup>
												<FormErrorMessage>{errors.password}</FormErrorMessage>
											</FormControl>
										)}
									</Field>
								</VStack>
								<Text mt="2" fontSize="sm">
									All fields are required.
								</Text>

								<Button
									mt="6"
									w="full"
									type="submit"
									variant="primary"
									disabled={
										!isValid ||
										isSubmitting ||
										!dirty ||
										!touched.email ||
										!touched.password ||
										!touched.username ||
										!touched.name
									}
									onSubmit={async () => {}}
								>
									Create account
								</Button>
							</Form>

							<Text
								my="4"
								textAlign="center"
								textDecor="underline"
								fontSize={["sm", "md"]}
								cursor="pointer"
								onClick={() => {
									close();
									setTimeout(() => {
										dispatch(openModal("login"));
									}, 300);
								}}
							>
								<a>Login</a>
							</Text>
						</ModalBody>
					)}
				</Formik>
			</ModalContent>
		</Modal>
	);
};

const SignupSchema = Yup.object().shape({
	name: Yup.string().required("Name is required"),
	username: Yup.string().required("Username is required"),
	email: Yup.string().required("Email is required"),
	password: Yup.string().required("Password is required"),
});
