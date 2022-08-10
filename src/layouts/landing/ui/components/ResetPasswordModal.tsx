import { Field, Form, Formik } from "formik";
import { useCallback } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import * as Yup from "yup";

import {
    Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, HStack, IconButton, Image,
    Input, InputGroup, InputRightElement, Link, Modal, ModalBody, ModalCloseButton, ModalContent,
    ModalHeader, ModalOverlay, Text, Tooltip, VStack
} from "@chakra-ui/react";

import { closeModal, openModal } from "../../../../app/slices/ui/modals";
import { FlowLogo } from "../../../../common-components";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../hooks/useAppSelector";


const emailFieldName = "email";

export const ResetPasswordModal: React.FC = () => {
	const dispatch = useAppDispatch();
	const { open } = useAppSelector(state => state.ui.modals.resetPassword);

	const close = useCallback(() => dispatch(closeModal("resetPassword")), []);

	return (
		<Modal size={["xs", "md", "lg", "xl"]} isOpen={open} onClose={close} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>
					<Flex justify="center">
						<FlowLogo size={50} />
					</Flex>
				</ModalHeader>
				<ModalCloseButton />
				<Formik
					validationSchema={ResetPasswordSchema}
					initialValues={{
						[emailFieldName]: "",
					}}
					onSubmit={(values, actions) => {}}
				>
					{({ errors, touched, validateForm, isSubmitting, isValid, dirty, getFieldProps }) => (
						<ModalBody>
							<Heading size="lg">Reset your password</Heading>
							<Text mt="4">
								We'll send a confirmation link to your email to reset your password.
							</Text>
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
								</VStack>
								<Button
									my="8"
									w="full"
									type="submit"
									variant="primary"
									disabled={!isValid || isSubmitting || dirty || !touched.email}
								>
									Send confirmation link
								</Button>
							</Form>
						</ModalBody>
					)}
				</Formik>
			</ModalContent>
		</Modal>
	);
};

const ResetPasswordSchema = Yup.object().shape({
	emailFieldName: Yup.string().email("Invalid email").required("Required"),
});
