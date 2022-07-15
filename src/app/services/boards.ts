import cacheUtils from "../../utils/cacheUtils";
import { iBoard } from "../../utils/models";
import api, { ApiTags } from "./api";


const boards = api.injectEndpoints({
	endpoints: builder => ({
		getUserBoards: builder.query<iBoard[], Pick<iBoard, "authorId">>({
			query: ({ authorId: userId }) => ({
				url: `/users/${userId}/boards`,
			}),

			providesTags: cacheUtils.providesList(ApiTags.Boards),
		}),

		getBoard: builder.query<iBoard, Pick<iBoard, "id">>({
			query: ({ id: boardId }) => ({
				url: `/boards/${boardId}`,
				method: "GET",
			}),

			providesTags: cacheUtils.cacheByIdArg(ApiTags.Boards),
		}),

		addBoard: builder.mutation<void, Pick<iBoard, "name" | "authorId">>({
			query: ({ name, authorId }) => ({
				url: `/boards`,
				method: "POST",
				body: {
					name,
					authorId,
				},
			}),

			invalidatesTags: cacheUtils.invalidatesList(ApiTags.Boards),
		}),
	}),
});

export const { useGetBoardQuery, useAddBoardMutation, useLazyGetUserBoardsQuery, useGetUserBoardsQuery } =
	boards;
