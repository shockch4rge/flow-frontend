import cacheUtils from "../../utils/cacheUtils";
import { iUser } from "../../utils/models";
import api, { ApiTags } from "./api";


interface LoginRequestBody {
	email: string;
	password: string;
}

const users = api.injectEndpoints({
	overrideExisting: false,

	endpoints: builder => ({
		getUser: builder.query<iUser, string>({
			query: id => ({
				url: `/users/${id}`,
				method: "get",
			}),

			providesTags: cacheUtils.cacheByIdArg(ApiTags.Users),
		}),

		loginUser: builder.query<iUser, LoginRequestBody>({
			query: ({ email, password }) => ({
				url: `/users/login`,
				method: "post",
				data: { email, password },
			}),
		}),

		createUser: builder.mutation<iUser, iUser>({
			query: user => ({
				url: `/users`,
				method: "post",
				data: user,
			}),
		}),
	}),
});

export const { useGetUserQuery, useCreateUserMutation, useLazyGetUserQuery, useLoginUserQuery } = users;
