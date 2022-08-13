import {
	Button,
	Editable,
	EditableInput,
	EditablePreview,
	EditableTextarea,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Heading,
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
	Textarea,
	Tooltip,
	useColorModeValue,
	useToast,
	VStack,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import { useCallback } from "react";
import { FaTrash } from "react-icons/fa";
import { useDeleteBoardMutation, useEditBoardMutation } from "../../../../app/services/boards";
import { closeModal } from "../../../../app/slices/ui/modals";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import * as Yup from "yup";

const nameField = "name";
const descriptionField = "description";

export const EditBoardModal: React.FC<{}> = () => {
	const toast = useToast();
	const dispatch = useAppDispatch();
	const currentBoard = useAppSelector(state => state.boards.current);
	const { open } = useAppSelector(state => state.ui.modals["editBoard"]);
	const [editBoard, { isLoading: isEditing }] = useEditBoardMutation();
	const [deleteBoard, { isLoading: isDeleting }] = useDeleteBoardMutation();

	const close = useCallback(() => dispatch(closeModal("editBoard")), []);

	const isLoading = isEditing || isDeleting;

	const handleDeleteBoard = async () => {
		if (!currentBoard) return;

		try {
			await deleteBoard({ id: currentBoard.id }).unwrap();
			close();
			toast({
				description: `${currentBoard.name} deleted!`,
				status: "success",
			});
		} catch (e) {
			toast({
				description: "There was an error deleting the board.",
				status: "error",
			});
		}
	};

	const handleEditBoard = async (name: string, description: string) => {
		if (!currentBoard) return;

		try {
			await editBoard({
				id: currentBoard.id,
				name,
				description,
			}).unwrap();
			close();
			toast({
				description: "Board updated!",
				status: "success",
			});
		} catch (e) {
			toast({
				description: "There was an error updating the board.",
				status: "error",
			});
		}
	};

	return (
		<Modal isOpen={open} onClose={close} size="2xl" isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>
					<Flex>
						<Heading size="lg">Edit Board</Heading>
						<Spacer />
						<Tooltip hasArrow label="Delete Board">
							<IconButton
								disabled={isDeleting}
								aria-label="Delete Board"
								onClick={handleDeleteBoard}
							>
								{isDeleting ? <Spinner /> : <FaTrash />}
							</IconButton>
						</Tooltip>
					</Flex>
				</ModalHeader>
				<Formik
					initialValues={{
						[nameField]: currentBoard!.name,
						[descriptionField]:
							currentBoard!.description === ""
								? "Board Description"
								: currentBoard!.description,
					}}
					validationSchema={EditBoardSchema}
					onSubmit={values => {
						handleEditBoard(values[nameField], values[descriptionField]);
					}}
				>
					{({ values, errors, isInitialValid, getFieldProps, isValid }) => (
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
													placeholder={currentBoard!.name}
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
													placeholder={currentBoard!.description}
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
								<Button isDisabled={isLoading} onClick={close}>
									{isLoading ? <Spinner /> : "Cancel"}
								</Button>
								<Button
									disabled={isLoading || !isValid}
									variant="primary"
									type="submit"
								>
									{isEditing ? <Spinner /> : "Save"}
								</Button>
							</ModalFooter>
						</Form>
					)}
				</Formik>
			</ModalContent>
		</Modal>
	);
};

const EditBoardSchema = Yup.object().shape({
	[nameField]: Yup.string()
		.required("Board name is required.")
		.min(3, "Board name must be at least 3 characters."),
	[descriptionField]: Yup.string(),
});
