import { MutationDefinition } from "@reduxjs/toolkit/dist/query";
import { UseMutation } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { createContext, PropsWithChildren, useCallback, useState } from "react";
import { iUser } from "../../utils/models";
import {
	useCreateUserMutation,
	useDeleteUserMutation,
	useLoginUserMutation,
	useResetPasswordMutation,
	useSignOutUserMutation,
	useUpdateUserMutation,
} from "../services/auth";

type AuthContextActions = {
	loginUser: (params: MutationParams<typeof useLoginUserMutation>) => Promise<void>;
	deleteUser: (params: MutationParams<typeof useDeleteUserMutation>) => Promise<void>;
	signOutUser: (params: MutationParams<typeof useSignOutUserMutation>) => Promise<void>;
	updateUser: (params: MutationParams<typeof useUpdateUserMutation>) => Promise<void>;
	createUser: (params: MutationParams<typeof useCreateUserMutation>) => Promise<void>;
	resetUserPassword: (params: MutationParams<typeof useResetPasswordMutation>) => Promise<void>;
};

type AuthContextType = [user: iUser | null, actions: AuthContextActions];

// get the parameter types of any defined endpoints
type MutationParams<M> = M extends UseMutation<infer D>
	? D extends MutationDefinition<infer Params, any, any, any>
		? Params
		: never
	: never;

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
	const [user, setUser] = useState<iUser | null>(null);
	const [login] = useLoginUserMutation();
	const [signOut] = useSignOutUserMutation();
	const [create] = useCreateUserMutation();
	const [_delete] = useDeleteUserMutation();
	const [update] = useUpdateUserMutation();
	const [resetPassword] = useResetPasswordMutation();

	const loginUser = useCallback(async (params: MutationParams<typeof useLoginUserMutation>) => {
		try {
			const authenticatedUser = await login(params).unwrap();
			setUser(authenticatedUser);
			console.log("Logged in user");
		} catch (e) {
			console.log("Could not login user");
		}
	}, []);

	const signOutUser = useCallback(
		async (params: MutationParams<typeof useSignOutUserMutation>) => {
			try {
				await signOut(params).unwrap();
				setUser(null);
				console.log("Signed out user");
			} catch (e) {
				console.log("Could not sign out user");
			}
		},
		[]
	);

	const createUser = useCallback(async (params: MutationParams<typeof useCreateUserMutation>) => {
		try {
			const createdUser = await create(params).unwrap();
			setUser(createdUser);
			console.log("Created user");
		} catch (e) {
			console.log("Could not create user");
		}
	}, []);

	const deleteUser = useCallback(async (params: MutationParams<typeof useDeleteUserMutation>) => {
		try {
			await _delete(params).unwrap();
			setUser(null);
			console.log("Deleted user");
		} catch (e) {
			console.log("Could not delete user");
		}
	}, []);

	const updateUser = useCallback(async (params: MutationParams<typeof useUpdateUserMutation>) => {
		try {
			const updatedUser = await update(params).unwrap();
			setUser(updatedUser);
			console.log("Updated user");
		} catch (e) {
			console.log("Could not update user");
		}
	}, []);

	const resetUserPassword = useCallback(
		async (params: MutationParams<typeof useResetPasswordMutation>) => {
			try {
				await resetPassword(params).unwrap();
				console.log("Reset user password");
			} catch (e) {
				console.log("Could not reset user password");
			}
		},
		[]
	);

	return (
		<AuthContext.Provider
			value={[
				user,
				{
					loginUser,
					signOutUser,
					createUser,
					deleteUser,
					updateUser,
					resetUserPassword,
				},
			]}
		>
			{children}
		</AuthContext.Provider>
	);
};
