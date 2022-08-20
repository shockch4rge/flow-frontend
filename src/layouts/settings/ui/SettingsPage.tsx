import { Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import {
    Avatar, Box, Button, Center, Flex, FormControl, FormErrorMessage, FormLabel, Heading, HStack,
    Input, Text, VStack
} from "@chakra-ui/react";

import { openModal } from "../../../app/slices/ui/modals";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { ConfirmDeleteProfileDialog } from "./components/ConfirmDeleteProfileDialog";
import { ResetPasswordModal } from "./components/ResetPasswordModal";

const fieldNames = {
    name: "name",
    username: "username",
    email: "email",
};

export const SettingsPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { user, updateUser, signOutUser } = useAuthContext();

    if (!user) return <></>;

    return (
        <>
            <Center p="12" w="full" h="full">
                <Flex direction="column" align="center" w="80">
                    <Heading size="xl">Profile Settings</Heading>
                    <Box mt="12" w="inherit">
                        <Formik
                            validationSchema={EditProfileSchema}
                            initialValues={{
                                [fieldNames.name]: user.name,
                                [fieldNames.email]: user.email,
                                [fieldNames.username]: user.username,
                            }}
                            onSubmit={values =>
                                updateUser({
                                    id: user.id,
                                    ...values,
                                })
                            }
                        >
                            {({ values, errors, touched, isValid, dirty, getFieldProps }) => (
                                <Form>
                                    <VStack w="full" spacing="6" align="center">
                                        <VStack w="inherit">
                                            <Field name={fieldNames.name}>
                                                {(props: any) => (
                                                    <FormControl
                                                        isInvalid={!!errors.name && touched.name}
                                                    >
                                                        <FormLabel htmlFor={fieldNames.name}>
                                                            Name
                                                        </FormLabel>
                                                        <Input
                                                            {...getFieldProps(fieldNames.name)}
                                                        />
                                                        <FormErrorMessage>
                                                            {errors.name}
                                                        </FormErrorMessage>
                                                    </FormControl>
                                                )}
                                            </Field>
                                            <Field name={fieldNames.username}>
                                                {(props: any) => (
                                                    <FormControl
                                                        isInvalid={
                                                            !!errors.username && touched.username
                                                        }
                                                    >
                                                        <FormLabel htmlFor={fieldNames.username}>
                                                            username
                                                        </FormLabel>
                                                        <Input
                                                            {...getFieldProps(fieldNames.username)}
                                                        />
                                                        <FormErrorMessage>
                                                            {errors.username}
                                                        </FormErrorMessage>
                                                    </FormControl>
                                                )}
                                            </Field>
                                            <Field name={fieldNames.email}>
                                                {(props: any) => (
                                                    <FormControl
                                                        w="full"
                                                        isInvalid={!!errors.email && touched.email}
                                                    >
                                                        <FormLabel htmlFor={fieldNames.email}>
                                                            Email
                                                        </FormLabel>
                                                        <Input
                                                            {...getFieldProps(fieldNames.email)}
                                                        />
                                                        <FormErrorMessage>
                                                            {errors.email}
                                                        </FormErrorMessage>
                                                    </FormControl>
                                                )}
                                            </Field>
                                        </VStack>
                                        <Text
                                            my="8"
                                            textDecor="underline"
                                            cursor="pointer"
                                            onClick={() => dispatch(openModal("resetPassword"))}
                                        >
                                            <a>Reset password</a>
                                        </Text>
                                    </VStack>
                                    <Button
                                        w="full"
                                        mt="24"
                                        disabled={!isValid || !dirty}
                                        variant="primary"
                                        onClick={() =>
                                            updateUser({
                                                id: user.id,
                                                username: values[fieldNames.username],
                                                name: values[fieldNames.name],
                                                email: values[fieldNames.email],
                                            })
                                        }
                                    >
                                        Save Changes
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                        <Button mt="2" w="full" onClick={() => signOutUser()}>
                            Log Out
                        </Button>
                        <ConfirmDeleteProfileDialog />
                    </Box>
                </Flex>
            </Center>
            <ResetPasswordModal />
        </>
    );
};

const EditProfileSchema = Yup.object({
    [fieldNames.name]: Yup.string(),
    [fieldNames.username]: Yup.string().min(3, "Username must be at least 3 characters"),
    [fieldNames.email]: Yup.string().email("Email must be a valid email address."),
});
