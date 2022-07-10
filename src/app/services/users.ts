import { cacher } from "../../utils/cacherUtils";
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

			providesTags: cacher.cacheByIdArg(ApiTags.Users),
		}),

		loginUser: builder.query<iUser, LoginRequestBody>({
			query: ({ email, password }) => ({
				url: `/users/login`,
				method: "post",
				data: { email, password },
			}),
		}),
	}),
});

export const { useGetUserQuery, useLazyGetUserQuery, useLoginUserQuery } = users;
