import {
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Heading,
	HStack,
	IconButton,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Spacer,
	Spinner,
	Text,
	VStack,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { closeModal } from "../../../../app/slices/ui/modals";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import * as Yup from "yup";
import { useDeleteFolderMutation, useEditFolderMutation } from "../../../../app/services/folder";
import { useCallback } from "react";
import { FaTrash } from "react-icons/fa";
import { Toast } from "../../../../common-components/toast";

export const modalName = "editFolder";
const nameField = "name";
const descriptionField = "description";

export const EditFolderModal: React.FC<{}> = () => {
	const dispatch = useAppDispatch();
	const { open, target } = useAppSelector(state => state.ui.modals[modalName]);
	const [editFolder, { isLoading: isEditingFolder }] = useEditFolderMutation();
	const [deleteFolder, { isLoading: isDeletingFolder }] = useDeleteFolderMutation();

	const isLoading = isEditingFolder || isDeletingFolder;

	const close = () => {
		dispatch(closeModal(modalName));
	};

	const handleDeleteFolder = async () => {
		if (!target) return;

		try {
			await deleteFolder({ id: target.id }).unwrap();
			close();
			Toast({
				description: `${target.name} deleted!`,
				colorScheme: "green",
			});
		} catch (e) {
			Toast({
				description: "There was an error deleting the folder.",
				colorScheme: "red",
			});
		}
	};

	const handleEditFolder = async (name: string, description: string) => {
		if (!target) return;

		try {
			await editFolder({
				id: target.id,
				name,
				description,
			}).unwrap();
			Toast({
				description: "Folder updated!",
				colorScheme: "green",
			});
		} catch (e) {
			Toast({
				description: "There was an error updating the folder.",
				colorScheme: "red",
			});
		}
	};

	return (
		<Modal isOpen={open} onClose={close} size="xl" isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>
					<Flex>
						<Heading size="lg">Edit Folder</Heading>
						<Spacer />
						<IconButton
							disabled={isLoading}
							aria-label="Delete folder"
							onClick={handleDeleteFolder}
						>
							{isLoading ? <Spinner /> : <FaTrash />}
						</IconButton>
					</Flex>
				</ModalHeader>
				<Formik
					initialValues={{
						[nameField]: "",
						[descriptionField]: "",
					}}
					validationSchema={EditFolderSchema}
					onSubmit={values =>
						handleEditFolder(values[nameField], values[descriptionField])
					}
				>
					{({
						values,
						errors,
						isInitialValid,
						enableReinitialize = true,
						getFieldProps,
						isValid,
					}) => (
						<Form>
							<ModalBody>
								<VStack my="6" spacing="6" justify="center">
									<Field name={nameField}>
										{(props: any) => (
											<FormControl isInvalid={!!errors.name}>
												<FormLabel htmlFor={nameField}>Name</FormLabel>
												<Input
													{...getFieldProps(nameField)}
													id={nameField}
													placeholder={target?.name}
												/>
												<FormErrorMessage>{errors.name}</FormErrorMessage>
											</FormControl>
										)}
									</Field>

									<Field name={descriptionField}>
										{(props: any) => (
											<FormControl isInvalid={!!errors.description}>
												<FormLabel htmlFor={descriptionField}>
													Description
												</FormLabel>
												<Input
													{...getFieldProps(descriptionField)}
													id={descriptionField}
													placeholder="Describe your folder."
												/>
												<FormErrorMessage>
													{errors.description}
												</FormErrorMessage>
											</FormControl>
										)}
									</Field>
								</VStack>
							</ModalBody>
							<ModalFooter>
								<Button
									disabled={isLoading || !isValid || !isInitialValid}
									variant="primary"
									onClick={() =>
										handleEditFolder(
											values[nameField],
											values[descriptionField]
										)
									}
								>
									{isLoading ? <Spinner /> : "Save"}
								</Button>
							</ModalFooter>
						</Form>
					)}
				</Formik>
			</ModalContent>
		</Modal>
	);
};

const EditFolderSchema = Yup.object().shape({
	[nameField]: Yup.string()
		.required("Folder name is required.")
		.min(3, "Folder name must be at least 3 characters."),
	[descriptionField]: Yup.string(),
});
