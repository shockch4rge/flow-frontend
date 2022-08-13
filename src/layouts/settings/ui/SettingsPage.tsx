import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import {
	Avatar,
	Box,
	Button,
	Center,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Heading,
	HStack,
	Input,
	Text,
	VStack,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { useAuthContext } from "../../../hooks/useAuthContext";

const fieldNames = {
	name: "name",
	email: "email",
};

export const SettingsPage: React.FC = () => {
	const { user, updateUser, signOutUser } = useAuthContext();

	console.log(user);

	return (
		<Center p="12" w="full" h="full">
			<Flex direction="column" align="center" w="80">
				<Heading size="xl">Profile Settings</Heading>
				<Box mt="12" w="inherit">
					<Formik
						validationSchema={EditProfileSchema}
						initialValues={{
							[fieldNames.name]: user!.name,
							[fieldNames.email]: user!.email,
						}}
						onSubmit={values =>
							updateUser({
								id: user!.id,
								...values,
							})
						}
					>
						{({ values, errors, touched, isInitialValid, isValid, getFieldProps }) => (
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
													<Input {...getFieldProps(fieldNames.name)} />
													<FormErrorMessage>
														{errors.name}
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
													<Input {...getFieldProps(fieldNames.email)} />
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
										onClick={() => {
											close();
											setTimeout(() => {
												// dispatch
											}, 300);
										}}
									>
										<a>Reset password</a>
									</Text>

									<VStack w="inherit">
										<Button
											w="full"
											disabled={!isValid || !isInitialValid}
											variant="primary"
											onClick={() =>
												updateUser({
													id: user!.id,
													name: values[fieldNames.name],
													email: values[fieldNames.email],
												})
											}
										>
											Save Changes
										</Button>
									</VStack>
								</VStack>
							</Form>
						)}
					</Formik>
					<Button mt="2" w="full" onClick={() => signOutUser()}>
						Log Out
					</Button>
				</Box>
			</Flex>
		</Center>
	);
};

const EditProfileSchema = Yup.object({
	[fieldNames.name]: Yup.string().length(3),
	[fieldNames.email]: Yup.string().email(),
});
