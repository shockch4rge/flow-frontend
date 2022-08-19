import { iUser } from "../../utils/models";
import api from "./api";

type JwtToken = { token: string };

type AuthorizedResponse = {
    status: {
        result: string;
        message: string;
    };
    user: iUser;
    authorization: JwtToken & { type: string };
};

const authService = api.injectEndpoints({
    overrideExisting: false,

    endpoints: builder => ({
        getCurrentUser: builder.query<{ status: {}; user: iUser }, void>({
            query: () => ({
                url: "/auth/me",
                method: "GET",
            }),
        }),

        getUser: builder.query<iUser, iUser["id"]>({
            query: userId => ({
                url: `/auth/${userId}`,
                method: "GET",
            }),
        }),

        loginUser: builder.mutation<
            AuthorizedResponse,
            Pick<iUser, "email"> & { password: string }
        >({
            query: ({ email, password }) => ({
                url: `/auth/login`,
                method: "POST",
                body: { email, password },
            }),
        }),

        signOutUser: builder.mutation<void, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
        }),

        createUser: builder.mutation<
            AuthorizedResponse,
            Pick<iUser, "name" | "email" | "username"> & { password: string }
        >({
            query: ({ email, name, password, username }) => ({
                url: `/auth/register`,
                method: "POST",
                body: {
                    name,
                    username,
                    email,
                    password,
                },
            }),
        }),

        updateUser: builder.mutation<
            iUser,
            Pick<iUser, "id"> & Partial<Pick<iUser, "username" | "email" | "name">>
        >({
            query: ({id, email, username, name}) => ({
                url: `/auth/${id}`,
                method: "PUT",
                body: {
                    email,
                    username,
                    name,
                },
            }),
        }),

        resetPassword: builder.mutation<void, { oldPassword: string; newPassword: string }>({
            query: ({ oldPassword, newPassword }) => ({
                url: `/auth/reset-password`,
                method: "POST",
                body: { oldPassword, newPassword },
            }),
        }),

        deleteUser: builder.mutation<void, void>({
            query: () => ({
                url: `/auth/destroy`,
                method: "DELETE",
            }),
        }),

        refreshAuth: builder.query<AuthorizedResponse, void>({
            query: () => ({
                url: `/auth/refresh`,
                method: "GET",
            }),
        }),
    }),
});

export const {
    useLoginUserMutation,
    useCreateUserMutation,
    useSignOutUserMutation,
    useUpdateUserMutation,
    useResetPasswordMutation,
    useDeleteUserMutation,
    useLazyGetCurrentUserQuery,
    useLazyRefreshAuthQuery,
} = authService;

export default authService;
