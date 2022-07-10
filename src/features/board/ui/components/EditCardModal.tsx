import { useState } from "react";
import { FaCross, FaPlus, FaTimes, FaXing } from "react-icons/fa";

import {
    AlertDialog, Box, Button, Editable, EditableInput, EditablePreview, Heading, HStack, IconButton,
    Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
    Tag, TagCloseButton, TagRightIcon, Text, Tooltip, useColorModeValue, Wrap, WrapItem
} from "@chakra-ui/react";

import { closeModal } from "../../../../app/slices/ui/modals";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../hooks/useAppSelector";


const modalName = "editCard";

export const EditCardModal: React.FC = () => {
	const dispatch = useAppDispatch();

	const [isAddingTag, setIsAddingTag] = useState(false);
	const { open, target } = useAppSelector(state => state.ui.modals[modalName]);

	const close = () => void dispatch(closeModal(modalName));
	const handleAddTag = (tagName: string) => {
		if (tagName.length === 0) {
			setIsAddingTag(false);
			return;
		}

		setIsAddingTag(false);
	};

	return (
		<Modal isOpen={open} onClose={close} size="2xl">
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>
					<Editable defaultValue={target?.name} isPreviewFocusable selectAllOnFocus>
						<Tooltip label="Click to edit">
							<EditablePreview
								w="100%"
								py={2}
								px={2}
								_hover={{
									bg: "gray.100",
								}}
							/>
						</Tooltip>
						<Input py={2} px={4} as={EditableInput} />
					</Editable>
				</ModalHeader>
				
				<ModalBody>
					<Heading size="md">Labels</Heading>
					<Wrap mt="4">
						<WrapItem>
							<Tag bg="green.100">
								Tech
								<TagCloseButton />
							</Tag>
						</WrapItem>
						{isAddingTag && (
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
							{isAddingTag ? (
								<IconButton
									size="xs"
									aria-label="Cancel"
									icon={<FaTimes opacity="50%" />}
									onClick={() => setIsAddingTag(false)}
								/>
							) : (
								<IconButton
									size="xs"
									aria-label="Add tag"
									icon={<FaPlus opacity="50%" />}
									onClick={() => setIsAddingTag(true)}
								/>
							)}
						</WrapItem>
					</Wrap>

					<Box mt="6">
						<Heading size="md">Description</Heading>
						<Text mt="4">{target?.description}</Text>
					</Box>
				</ModalBody>

				<ModalFooter>
					<HStack>
						<Button onClick={close}>Cancel</Button>
						<Button
							bgColor="green.200"
							textColor="green.700"
							_hover={{ bgColor: "green.300" }}
							_active={{ bgColor: "green.400", textColor: "green.900" }}
							onClick={() => {
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
