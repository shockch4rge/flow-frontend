import { cacher } from "../../utils/cacherUtils";
import { iBoard } from "../../utils/models";
import api, { ApiTags } from "./api";


const boards = api.injectEndpoints({
	endpoints: builder => ({
		getUserBoards: builder.query<iBoard[], string>({
			query: userId => ({
				url: `/users/${userId}/boards`,
			}),
		}),

		getBoard: builder.query<iBoard, string>({
			query: id => ({
				url: `/boards/${id}`,
				method: "GET",
			}),
		}),

		addBoard: builder.mutation<void, iBoard>({
			query: board => ({
				url: `/boards`,
				method: "POST",
				body: board,
			}),

			invalidatesTags: cacher.invalidatesList(ApiTags.Boards),
		}),
	}),
});

export const { useGetBoardQuery, useAddBoardMutation, useLazyGetUserBoardsQuery, useGetUserBoardsQuery } = boards;
