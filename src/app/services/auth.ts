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
				// headers: authHeaders(token),
			}),
		}),

		createUser: builder.mutation<
			AuthorizedResponse,
			Pick<iUser, "name" | "email"> & { password: string }
		>({
			query: ({ email, name, password }) => ({
				url: `/register`,
				method: "POST",
				body: {
					email,
					name,
					password,
				},
			}),
		}),

		updateUser: builder.mutation<
			iUser,
			Pick<iUser, "id"> & Partial<Pick<iUser, "username" | "email" | "name">>
		>({
			query: user => ({
				url: `/users/${user.id}`,
				method: "PUT",
				body: user,
				// headers: authHeaders(token),
			}),
		}),

		resetPassword: builder.mutation<void, Pick<iUser, "email">>({
			query: ({ email }) => ({
				url: `/users/reset-password`,
				method: "POST",
				body: { email },
				// headers: authHeaders(token),
			}),
		}),

		deleteUser: builder.mutation<void, Pick<iUser, "id"> & JwtToken>({
			query: ({ id, token }) => ({
				url: `/users/${id}`,
				method: "DELETE",
				// headers: authHeaders(token),
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
} = authService;

export default authService;
