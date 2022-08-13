import { useToast } from "@chakra-ui/react";
import { MutationDefinition } from "@reduxjs/toolkit/dist/query";
import { UseMutation } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { createContext, PropsWithChildren, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppSelector";
import { iUser } from "../../utils/models";
import { AppRoutes } from "../../utils/routes";
import {
	useCreateUserMutation,
	useDeleteUserMutation,
	useLoginUserMutation,
	useResetPasswordMutation,
	useSignOutUserMutation,
	useUpdateUserMutation,
} from "../services/auth";

type AuthContextState = {
	user: iUser | null;
	loginUser: (params: MutationParams<typeof useLoginUserMutation>) => Promise<void>;
	deleteUser: (params: MutationParams<typeof useDeleteUserMutation>) => Promise<void>;
	signOutUser: (params: MutationParams<typeof useSignOutUserMutation>) => Promise<void>;
	updateUser: (params: MutationParams<typeof useUpdateUserMutation>) => Promise<void>;
	createUser: (params: MutationParams<typeof useCreateUserMutation>) => Promise<void>;
	resetUserPassword: (params: MutationParams<typeof useResetPasswordMutation>) => Promise<void>;
};

// get the parameter types of any defined endpoints
type MutationParams<M> = M extends UseMutation<infer D>
	? D extends MutationDefinition<infer Params, any, any, any>
		? Params
		: never
	: never;

export const AuthContext = createContext<AuthContextState | null>(null);

export const AuthProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
	const toast = useToast();
	const navigate = useNavigate();
	const [login] = useLoginUserMutation();
	const [signOut] = useSignOutUserMutation();
	const [create] = useCreateUserMutation();
	const [_delete] = useDeleteUserMutation();
	const [update] = useUpdateUserMutation();
	const [resetPassword] = useResetPasswordMutation();
	const { user, token } = useAppSelector(state => state.auth);

	const loginUser = useCallback(async (params: MutationParams<typeof useLoginUserMutation>) => {
		try {
			await login(params).unwrap();
			toast({
				status: "success",
				description: "Login successful!",
			});
		} catch (e) {
			console.warn("Could not login user", e);
			toast({
				status: "error",
				description: "There was a problem logging in. Please try again.",
			});
		}
	}, []);

	const signOutUser = useCallback(
		async (params: MutationParams<typeof useSignOutUserMutation>) => {
			try {
				await signOut(params).unwrap();
				toast({
					status: "success",
					description: "Signed out of your account!",
				});
			} catch (e) {
				console.warn("Could not sign out user", e);
				toast({
					status: "error",
					description: "There was a problem registering your account. Please try again.",
				});
			}
		},
		[]
	);

	const createUser = useCallback(async (params: MutationParams<typeof useCreateUserMutation>) => {
		try {
			await create(params).unwrap();
			toast({
				status: "success",
				description: "Created your! account!",
			});
		} catch (e) {
			console.warn("Could not create user", e);
			toast({
				status: "error",
				description: "There was a problem registering your account. Please try again.",
			});
		}
	}, []);

	const deleteUser = useCallback(async (params: MutationParams<typeof useDeleteUserMutation>) => {
		try {
			await _delete(params).unwrap();
			toast({
				status: "success",
				description: "Account deleted.",
			});
		} catch (e) {
			console.warn("Could not delete user", e);
			toast({
				status: "error",
				description: "There was a problem deleting your account. Please try again.",
			});
		}
	}, []);

	const updateUser = useCallback(async (params: MutationParams<typeof useUpdateUserMutation>) => {
		try {
			await update(params).unwrap();
			toast({
				status: "success",
				description: "Updated account details!",
			});
		} catch (e) {
			console.warn("Could not update user", e);
			toast({
				status: "error",
				description: "There was a problem deleting your account. Please try again.",
			});
		}
	}, []);

	const resetUserPassword = useCallback(
		async (params: MutationParams<typeof useResetPasswordMutation>) => {
			try {
				await resetPassword(params).unwrap();
				console.log("Reset user password");
				toast({
					status: "success",
					description: "Updated password!",
				});
			} catch (e) {
				console.log("Could not reset user password", e);
				toast({
					status: "error",
					description: "There was a problem resetting your password. Please try again.",
				});
			}
		},
		[]
	);

	useEffect(() => {
		if (!token || !user) {
			navigate(AppRoutes.Landing);
			return;
		}

		navigate(AppRoutes.Board);
	}, [token, user]);

	return (
		<AuthContext.Provider
			value={{
				user,
				loginUser,
				signOutUser,
				createUser,
				deleteUser,
				updateUser,
				resetUserPassword,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
