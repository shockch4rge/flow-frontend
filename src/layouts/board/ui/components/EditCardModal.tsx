import { useMemo, useState } from "react";
import {
	FaCheckSquare,
	FaCross,
	FaPlus,
	FaStickyNote,
	FaTimes,
	FaTrash,
	FaXing,
} from "react-icons/fa";

import {
	Box,
	Button,
	Editable,
	EditableInput,
	EditablePreview,
	EditableTextarea,
	Flex,
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
	Spinner,
	Stack,
	Tag,
	TagCloseButton,
	TagRightIcon,
	Text,
	Tooltip,
	VStack,
	Wrap,
	WrapItem,
} from "@chakra-ui/react";

import { useDeleteCardMutation } from "../../../../app/services/cards";
import { closeModal } from "../../../../app/slices/ui/modals";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../hooks/useAppSelector";

const modalName = "editCard";

export const EditCardModal: React.FC = () => {
	const dispatch = useAppDispatch();
	const { open, target } = useAppSelector(state => state.ui.modals[modalName]);
	const [deleteCard, { isLoading: isDeletingCard, isSuccess: hasDeletedCard }] =
		useDeleteCardMutation();
	const [isAddingTagMode, setIsAddingTagMode] = useState(false);

	const close = () => void dispatch(closeModal(modalName));

	const handleAddTag = (tagName: string) => {
		if (tagName.length === 0) {
			setIsAddingTagMode(false);
			return;
		}

		setIsAddingTagMode(false);
	};

	const handleDeleteCard = async () => {
		if (!target) return;

		await deleteCard(target.id);

		close();
	};

	const componentButtons = useMemo(() => {
		return [
			{
				icon: <FaCheckSquare />,
				name: "Checklist",
				onClick: () => {},
			},
			{
				icon: <FaStickyNote />,
				name: "Notepad",
				onClick: () => {},
			},
		];
	}, []);

	return (
		<Modal
			isOpen={open}
			onClose={close}
			size={["lg", "xl", "3xl", "4xl"]}
			closeOnOverlayClick={false}
			autoFocus={false}
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader as={HStack}>
					<Tooltip label="Click to edit" hasArrow openDelay={1000}>
						<Editable
							flex="1"
							defaultValue={target?.name}
							borderRadius="6"
							isPreviewFocusable
							selectAllOnFocus
							_hover={{
								bg: "gray.50",
							}}
						>
							<EditablePreview py={2} px={4} w="100%" />
							<Input py={2} px={4} as={EditableInput} />
						</Editable>
					</Tooltip>
					<IconButton aria-label="Delete card" onClick={handleDeleteCard}>
						{isDeletingCard || hasDeletedCard ? <Spinner /> : <FaTrash />}
					</IconButton>
				</ModalHeader>

				<ModalBody>
					<Flex direction={["column", "column", "row", "row"]}>
						<VStack mr="6" flex="3" align="stretch" spacing="4">
							<Box p="4">
								<Heading size="md">Labels</Heading>
								<Wrap mt="4">
									<WrapItem>
										<Tag bg="blue.300" textColor="white">
											Tech
											<TagCloseButton color="white" />
										</Tag>
									</WrapItem>
									{isAddingTagMode && (
										<WrapItem>
											<Editable
												fontSize={"sm"}
												defaultValue="New tag"
												isPreviewFocusable={true}
												selectAllOnFocus={true}
												startWithEditView={true}
												onSubmit={handleAddTag}
											>
												<EditablePreview
													py={1}
													px={1}
													bg="gray.50"
													_hover={{
														bg: "gray.100",
													}}
												/>
												<Input py={2} px={4} as={EditableInput} />
											</Editable>
										</WrapItem>
									)}
									<WrapItem>
										{isAddingTagMode ? (
											<IconButton
												size="xs"
												aria-label="Cancel"
												icon={<FaTimes opacity="50%" />}
												onClick={() => setIsAddingTagMode(false)}
											/>
										) : (
											<IconButton
												size="xs"
												aria-label="Add tag"
												icon={<FaPlus opacity="50%" />}
												onClick={() => setIsAddingTagMode(true)}
											/>
										)}
									</WrapItem>
								</Wrap>
							</Box>

							<Box p="4">
								<Heading size="md">Description</Heading>
								<Editable
									mt="3"
									noOfLines={3}
									defaultValue={
										target?.description === ""
											? "No description provided."
											: target?.description
									}
								>
									<EditablePreview />
									<EditableTextarea resize="none" />
								</Editable>
							</Box>
						</VStack>

						<Box p="4" flex="1">
							<VStack align="start">
								<Heading size="md">Components</Heading>
								<VStack
									w="100%"
									mt="4"
									p="2"
									borderRadius="6"
									bgColor="gray.100"
									align="center"
								>
									{componentButtons.map(({ icon, name, onClick }) => (
										<Button
											key={name}
											w="100%"
											bg="white"
											leftIcon={icon}
											fontWeight="medium"
											onClick={onClick}
										>
											{name}
										</Button>
									))}
								</VStack>
							</VStack>
						</Box>
					</Flex>
				</ModalBody>

				<ModalFooter>
					<HStack>
						<Button onClick={close}>Cancel</Button>
						<Button
							variant="primary"
							onClick={() => {
								// save edits
								close();
							}}
						>
							Save
						</Button>
					</HStack>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
