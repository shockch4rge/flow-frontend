import { Field, Form, Formik } from "formik";
import { useCallback } from "react";
import { FaTrash } from "react-icons/fa";
import * as Yup from "yup";

import {
    Button, Editable, EditablePreview, EditableTextarea, Flex, FormControl, FormErrorMessage,
    FormLabel, Heading, HStack, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent,
    ModalFooter, ModalHeader, ModalOverlay, Spacer, Spinner, Text, Textarea, useToast, VStack
} from "@chakra-ui/react";

import { useDeleteFolderMutation, useEditFolderMutation } from "../../../../app/services/folder";
import { closeModal } from "../../../../app/slices/ui/modals";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../hooks/useAppSelector";

export const modalName = "editFolder";
const nameField = "name";
const descriptionField = "description";

export const EditFolderModal: React.FC<{}> = () => {
	const dispatch = useAppDispatch();
	const toast = useToast();
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
			toast({
				description: `${target.name} deleted!`,
				status: "success",
			});
		} catch (e) {
			toast({
				description: "There was an error deleting the folder.",
				status: "error",
			});
		}
	};

	const handleEditFolder = async (name: string, description: string) => {
		if (!target) return;

		try {
			await editFolder({
				id: target.id,
				boardId: target.boardId,
				name,
				description,
			}).unwrap();
			close();
			toast({
				description: "Folder updated!",
				status: "success",
			});
		} catch (e) {
			toast({
				description: "There was an error updating the folder. Please try again",
				status: "error",
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
						[nameField]: target?.name ?? "",
						[descriptionField]: "",
					}}
					validationSchema={EditFolderSchema}
					onSubmit={values =>
						handleEditFolder(values[nameField], values[descriptionField])
					}
				>
					{({ values, errors, getFieldProps, isValid }) => (
						<Form>
							<ModalBody my="4">
								<VStack spacing="6" justify="center">
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
												<Textarea
													{...getFieldProps(descriptionField)}
													id={descriptionField}
													placeholder={target?.description}
													resize="none"
												/>
												<FormErrorMessage>
													{errors.description}
												</FormErrorMessage>
											</FormControl>
										)}
									</Field>
								</VStack>
							</ModalBody>
							<ModalFooter gap="4">
								<Button isDisabled={!isValid || isLoading} onClick={close}>
									{isLoading ? <Spinner /> : "Cancel"}
								</Button>

								<Button
									disabled={isLoading || !isValid}
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
