import { createContext, PropsWithChildren, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useToast } from "@chakra-ui/react";
import { MutationDefinition } from "@reduxjs/toolkit/dist/query";
import { UseMutation } from "@reduxjs/toolkit/dist/query/react/buildHooks";

import { useAppSelector } from "../../hooks/useAppSelector";
import { iUser } from "../../utils/models";
import { AppRoutes } from "../../utils/routes";
import {
    useCreateUserMutation, useDeleteUserMutation, useLazyRefreshAuthQuery, useLoginUserMutation,
    useResetPasswordMutation, useSignOutUserMutation, useUpdateUserMutation
} from "../services/auth";

type AuthContextState = {
    user: iUser | null;
    token: string | null;
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
    const [refreshAuth] = useLazyRefreshAuthQuery();

    useEffect(() => {
        if (!token || !user) {
            navigate(AppRoutes.Landing, { replace: true });
            return;
        }

        navigate(AppRoutes.Board, { replace: true });

        // refreshAuth().unwrap().then(() => {
        // 	navigate(AppRoutes.Board, { replace: true });
        // })
    }, [token, user]);

    const loginUser = async (params: MutationParams<typeof useLoginUserMutation>) => {
        try {
            await login(params).unwrap();
            toast({
                status: "success",
                description: "Login successful!",
            });
        } catch (e) {
            toast({
                status: "error",
                description: (e as any).data.status.message,
            });
        }
    };

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
                    description: "There was a problem logging out. Please try again.",
                });
            }
        },
        []
    );

    const createUser = async (params: MutationParams<typeof useCreateUserMutation>) => {
        try {
            const result = await create(params).unwrap();
            toast({
                status: "success",
                description: "Created your account!",
            });
        } catch (e) {
            console.warn("Could not create user", e);
            toast({
                status: "error",
                description: "There was a problem registering your account. Please try again.",
            });
        }
    };

    const deleteUser = async (params: MutationParams<typeof useDeleteUserMutation>) => {
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
    };

    const updateUser = async (params: MutationParams<typeof useUpdateUserMutation>) => {
        try {
            await update(params).unwrap();
            await refreshAuth().unwrap();
            toast({
                status: "success",
                description: "Updated account details!",
            });
        } catch (e) {
            console.warn("Could not update user", e);
            toast({
                status: "error",
                description: "There was a problem updating your account. Please try again.",
            });
        }
    };

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

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
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
