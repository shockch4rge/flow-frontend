import { Field, Form, Formik } from "formik";
import { useCallback, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";

import {
    Box, Button, ButtonGroup, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Hide, HStack,
    IconButton, Image, Input, InputGroup, InputRightElement, Link, Modal, ModalBody,
    ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Tooltip, VStack
} from "@chakra-ui/react";

import { closeModal, openModal } from "../../../../app/slices/ui/modals";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { AppRoutes } from "../../../../utils/routes";


const loginModalName = "login";
const emailFieldName = "email";
const passwordFieldName = "password";

export const LoginModal: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [showPassword, setShowPassword] = useState(false);
	const { open } = useAppSelector(state => state.ui.modals.login);

	const close = useCallback(() => dispatch(closeModal(loginModalName)), []);

	return (
		<Modal size={["xs", "md", "lg", "xl"]} isCentered isOpen={open} onClose={close}>
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
					{({ errors, touched, isSubmitting, isValid, dirty, getFieldProps }) => (
						<ModalBody>
							<Heading textAlign="center" size="lg">
								Login <Hide below="md">to your account</Hide>
							</Heading>

							<Form>
								<VStack mt="10" spacing="6" justify="center">
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
												<Text
													mb="-6"
													textColor="green.400"
													textDecor="underline"
													textAlign="end"
													fontSize="sm"
													cursor="pointer"
													onClick={() => {
														close();
														setTimeout(() => {
															dispatch(openModal("resetPassword"));
														}, 300);
													}}
												>
													Forgot your password?
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

								<Button
									mt="12"
									w="full"
									type="submit"
									variant="primary"
									// TODO: add login validation
									// disabled={
									// 	!isValid ||
									// 	isSubmitting ||
									// 	!dirty ||
									// 	!touched.email ||
									// 	!touched.password
									// }
									onClick={() => navigate(AppRoutes.Board)}
								>
									Login
								</Button>
							</Form>

							<Text
								my="8"
								textAlign="center"
								textDecor="underline"
								cursor="pointer"
								onClick={() => {
									close();
									setTimeout(() => {
										dispatch(openModal("signup"));
									}, 300);
								}}
							>
								<a>Create Account</a>
							</Text>
						</ModalBody>
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
