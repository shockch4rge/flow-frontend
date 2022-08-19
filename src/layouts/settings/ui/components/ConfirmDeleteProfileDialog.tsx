import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Box,
	Button,
	useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useAuthContext } from "../../../../hooks/useAuthContext";

export const ConfirmDeleteProfileDialog: React.FC<{}> = () => {
	const cancelRef = useRef(null);
	const { deleteUser } = useAuthContext();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const handleConfirm = async () => {
		await deleteUser();
		onClose();
	};

	return (
		<>
			<Button mt="2" w="full" variant="ghost" colorScheme="red" onClick={onOpen}>
				Delete Profile
			</Button>
			<AlertDialog
				isOpen={isOpen}
				leastDestructiveRef={cancelRef}
				onClose={onClose}
				isCentered
			>
				<AlertDialogOverlay />
				<AlertDialogContent>
					<AlertDialogHeader fontSize="lg" fontWeight="bold">
						Delete Profile
					</AlertDialogHeader>

					<AlertDialogBody>
						Are you sure? You can't undo this action afterwards.
					</AlertDialogBody>

					<AlertDialogFooter>
						<Button ref={cancelRef} onClick={onClose}>
							Cancel
						</Button>
						<Button colorScheme="red" onClick={handleConfirm} ml="3">
							Delete
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};
