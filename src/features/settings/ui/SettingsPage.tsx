import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import {
	Avatar,
	Box,
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Heading,
	HStack,
	Input,
	VStack,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";

const fieldNames = {
	name: "name",
	email: "email",
	password: "password",
};

export const SettingsPage: React.FC = () => {
	const navigate = useNavigate();

	return (
		<Box p="12">
			<Heading>Profile Settings</Heading>
			<Box mt="12">
				<Formik
					validationSchema={EditProfileSchema}
					initialValues={{
						[fieldNames.name]: "",
						[fieldNames.email]: "",
						[fieldNames.password]: "",
					}}
					onSubmit={() => {}}
				>
					{({ errors, touched, isSubmitting, isValid, dirty, getFieldProps }) => (
						<Form>
							<VStack spacing="6" align="start">
								<HStack spacing="6">
									<Avatar size="xl" />
									<Heading>John Doe</Heading>
								</HStack>
								<VStack>
									<Field name={fieldNames.name}>
										{(props: any) => (
											<FormControl isInvalid={!!errors.name && touched.name}>
												<FormLabel htmlFor={fieldNames.name}>
													Name
												</FormLabel>
												<Input {...getFieldProps(fieldNames.name)} />
												<FormErrorMessage>{errors.name}</FormErrorMessage>
											</FormControl>
										)}
									</Field>
									<Field name={fieldNames.email}>
										{(props: any) => (
											<FormControl
												isInvalid={!!errors.email && touched.email}
											>
												<FormLabel htmlFor={fieldNames.email}>
													Email
												</FormLabel>
												<Input {...getFieldProps(fieldNames.email)} />
												<FormErrorMessage>{errors.email}</FormErrorMessage>
											</FormControl>
										)}
									</Field>
								</VStack>
							</VStack>
							<Button mt="6" variant="primary">
								Save Changes
							</Button>
						</Form>
					)}
				</Formik>
			</Box>
		</Box>
	);
};

const EditProfileSchema = Yup.object({
	[fieldNames.name]: Yup.string().length(3),
	[fieldNames.email]: Yup.string().email(),
	[fieldNames.password]: Yup.string().min(8),
});
