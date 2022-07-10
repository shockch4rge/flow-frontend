import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import * as Yup from "yup";

import {
    Box, Button, ButtonGroup, Flex, FormControl, FormErrorMessage, FormLabel, Heading, HStack,
    IconButton, Image, Input, InputGroup, InputRightElement, Link, Modal, ModalBody,
    ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Tooltip, VStack
} from "@chakra-ui/react";

import { closeModal, openModal } from "../../../../app/slices/ui/modals";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../hooks/useAppSelector";


const loginModalName = "login";
const emailFieldName = "email";
const passwordFieldName = "password";

export const LoginModal: React.FC = () => {
	const dispatch = useAppDispatch();
	const [showPassword, setShowPassword] = useState(false);
	const { open } = useAppSelector(state => state.ui.modals.login);

	return (
		<Modal size="xl" isCentered isOpen={open} onClose={() => dispatch(closeModal(loginModalName))}>
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
					validationSchema={LoginSchema}
					initialValues={{
						[emailFieldName]: "",
						[passwordFieldName]: "",
					}}
					onSubmit={(values, actions) => {}}
				>
					{({
						errors,
						touched,
						validateForm,
						isSubmitting,
						isValidating,
						isValid,
						dirty,
						getFieldProps,
					}) => (
						<>
							<ModalBody mt="6">
								<Heading>Login.</Heading>
								<Form>
									<VStack mt="12" spacing="6" justify="center">
										<Field name={emailFieldName}>
											{(props: any) => (
												<FormControl isInvalid={!!errors.email && touched.email}>
													<FormLabel htmlFor={emailFieldName}>Email</FormLabel>
													<Input
														{...getFieldProps(emailFieldName)}
														id={emailFieldName}
														placeholder="Email"
													/>
													<FormErrorMessage>{errors.email}</FormErrorMessage>
												</FormControl>
											)}
										</Field>

										<Field name={passwordFieldName}>
											{(props: any) => (
												<FormControl isInvalid={!!errors.password && touched.password}>
													<Text
														textColor="green.400"
														textDecor="underline"
														textAlign="end"
														fontSize="sm"
														mb="-6"
													>
														<Link as={RouterLink} to="/signup">
															Forgot your password?
														</Link>
													</Text>
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

									<Text my="8" textAlign="center" textDecor="underline">
										<Link as={RouterLink} to="/signup">
											Create Account
										</Link>
									</Text>
								</Form>
							</ModalBody>

							<ModalFooter>
								<ButtonGroup>
									<Button onClick={() => dispatch(closeModal(loginModalName))}>
										Cancel
									</Button>
									<Button
										type="submit"
										variant="solid"
										disabled={!isValid || dirty || isSubmitting}
									>
										Login
									</Button>
								</ButtonGroup>
							</ModalFooter>
						</>
					)}
				</Formik>
			</ModalContent>
		</Modal>
	);
};

const LoginSchema = Yup.object().shape({
	[emailFieldName]: Yup.string().email("Invalid email").required("Email is required."),
	[passwordFieldName]: Yup.string().required("Password is required."),
});
