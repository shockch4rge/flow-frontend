import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { FaEye, FaEyeSlash, FaTrash } from "react-icons/fa";
import * as Yup from "yup";

import {
    Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, IconButton, Input, InputGroup,
    InputRightElement, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
    Spacer, Spinner, Text, Tooltip, VStack
} from "@chakra-ui/react";

import { useResetPasswordMutation } from "../../../../app/services/auth";
import { closeModal } from "../../../../app/slices/ui/modals";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { useAuthContext } from "../../../../hooks/useAuthContext";

const emailField = "email";
const oldPasswordField = "oldPassword";
const newPasswordField = "password";

export const ResetPasswordModal: React.FC = () => {
    const dispatch = useAppDispatch();
    const { user } = useAuthContext();
    const { open } = useAppSelector(state => state.ui.modals.resetPassword);
    const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();
    const [showPassword, setShowPassword] = useState(false);

    const isLoading = isResetting;

    const close = () => dispatch(closeModal("resetPassword"));

    return (
        <Modal isOpen={open} onClose={close} size="xl" isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Heading size="lg">Reset Password</Heading>
                </ModalHeader>
                <Formik
                    initialValues={{
                        [emailField]: "",
                        [oldPasswordField]: "",
                        [newPasswordField]: "",
                    }}
                    validationSchema={ResetPasswordSchema}
                    onSubmit={values => {}}
                >
                    {({ values, errors, getFieldProps, isValid }) => (
                        <Form>
                            <ModalBody>
                                <Text>
                                    Let's reset your password. But first, we'll need to
                                    reauthenticate using your email and your current password.
                                </Text>
                                <VStack my="6" spacing="6" justify="center">
                                    <Field name={oldPasswordField}>
                                        {(props: any) => (
                                            <FormControl isInvalid={!!errors.password}>
                                                <FormLabel htmlFor={oldPasswordField}>
                                                    Old Password
                                                </FormLabel>
                                                <InputGroup>
                                                    <Input
                                                        {...getFieldProps(oldPasswordField)}
                                                        id={oldPasswordField}
                                                        placeholder="e.g. johndoe123"
                                                        type={showPassword ? "text" : "password"}
                                                    />
                                                    <Tooltip
                                                        label="Toggle Visibility"
                                                        openDelay={1000}
                                                        hasArrow
                                                    >
                                                        <InputRightElement
                                                            onClick={() =>
                                                                setShowPassword(!showPassword)
                                                            }
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
                                                <FormErrorMessage>
                                                    {errors.password}
                                                </FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name={newPasswordField}>
                                        {(props: any) => (
                                            <FormControl isInvalid={!!errors.password}>
                                                <FormLabel htmlFor={newPasswordField}>
                                                    New Password
                                                </FormLabel>
                                                <InputGroup>
                                                    <Input
                                                        {...getFieldProps(newPasswordField)}
                                                        id={newPasswordField}
                                                        placeholder="e.g. johndoe123"
                                                        type={showPassword ? "text" : "password"}
                                                    />
                                                    <Tooltip
                                                        label="Toggle Visibility"
                                                        openDelay={1000}
                                                        hasArrow
                                                    >
                                                        <InputRightElement
                                                            onClick={() =>
                                                                setShowPassword(!showPassword)
                                                            }
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
                                                <FormErrorMessage>
                                                    {errors.password}
                                                </FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                </VStack>
                            </ModalBody>
                            <ModalFooter gap="4">
                                <Button isDisabled={isResetting} onClick={close}>
                                    {isResetting ? <Spinner /> : "Cancel"}
                                </Button>
                                <Button disabled={isLoading} variant="primary" onClick={() => {
									resetPassword({
										oldPassword: values[oldPasswordField],
										newPassword: values[newPasswordField],
									})
								}}>
                                    {isResetting ? <Spinner /> : "Save"}
                                </Button>
                            </ModalFooter>
                        </Form>
                    )}
                </Formik>
            </ModalContent>
        </Modal>
    );
};

const ResetPasswordSchema = Yup.object().shape({
    [oldPasswordField]: Yup.string().required("Old password is required."),
    [newPasswordField]: Yup.string().required("New password is required."),
});
