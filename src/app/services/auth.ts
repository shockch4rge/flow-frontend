import cacheUtils from "../../utils/cacheUtils";
import { iUser } from "../../utils/models";
import api, { ApiTags, authHeaders } from "./api";

type JwtToken = { token: string };

const auth = api.injectEndpoints({
	overrideExisting: false,

	endpoints: builder => ({
		getUser: builder.query<iUser, iUser["id"]>({
			query: userId => ({
				url: `/users/${userId}`,
				method: "GET",
			}),
		}),

		loginUser: builder.mutation<iUser, Pick<iUser, "email"> & { password: string } & JwtToken>({
			query: ({ email, password, token }) => ({
				url: `/users/login`,
				method: "POST",
				data: { email, password },
				headers: authHeaders(token),
			}),
		}),

		signOutUser: builder.mutation<void, JwtToken>({
			query: ({ token }) => ({
				url: "/users/signout",
				method: "POST",
				headers: authHeaders(token),
			}),
		}),

		createUser: builder.mutation<iUser, Pick<iUser, "name" | "email"> & { password: string }>({
			query: ({ email, name, password }) => ({
				url: `/users`,
				method: "POST",
				data: {
					email,
					name,
					password,
				},
			}),
		}),

		updateUser: builder.mutation<
			iUser,
			Pick<iUser, "id"> & Partial<Pick<iUser, "username" | "email" | "name">> & JwtToken
		>({
			query: ({ token, ...user }) => ({
				url: `/users/${user.id}`,
				method: "PUT",
				data: user,
				headers: authHeaders(token),
			}),
		}),

		resetPassword: builder.mutation<void, Pick<iUser, "email"> & JwtToken>({
			query: ({ email, token }) => ({
				url: `/users/reset-password`,
				method: "POST",
				data: { email },
				headers: authHeaders(token),
			}),
		}),

		deleteUser: builder.mutation<void, Pick<iUser, "id"> & JwtToken>({
			query: ({ id, token }) => ({
				url: `/users/${id}`,
				method: "DELETE",
				headers: authHeaders(token),
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
} = auth;
