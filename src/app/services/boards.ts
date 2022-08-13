import cacheUtils from "../../utils/cacheUtils";
import { iBoard } from "../../utils/models";
import api, { ApiTags } from "./api";

const boardService = api.injectEndpoints({
	endpoints: builder => ({
		getUserBoards: builder.query<iBoard[], iBoard["authorId"]>({
			query: userId => ({
				url: `/users/${userId}/boards`,
				method: "GET",
			}),

			providesTags: cacheUtils.providesList(ApiTags.Boards),
		}),

		getBoard: builder.query<iBoard, iBoard["id"]>({
			query: boardId => ({
				url: `/boards/${boardId}`,
				method: "GET",
			}),

			providesTags: cacheUtils.cacheByIdArg(ApiTags.Boards),
		}),

		addBoard: builder.mutation<iBoard, Pick<iBoard, "name" | "authorId">>({
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

		editBoard: builder.mutation<void, Pick<iBoard, "id"> & Partial<Omit<iBoard, "authorId">>>({
			query: ({ id, name, description }) => ({
				url: `/boards/${id}`,
				method: "PUT",
				body: {
					name,
					description,
				},
			}),

			onQueryStarted: async ({ id, name, description }, { dispatch, queryFulfilled }) => {
				const patchResult = dispatch(
					boardService.util.updateQueryData("getUserBoards", id, boards => {
						const index = boards.findIndex(b => b.id === id);

						if (index) {
							name && (boards[index].name = name);
							description && (boards[index].description = description);
						}
					})
				);

				try {
					await queryFulfilled;
				} catch (e) {
					patchResult.undo();
				}
			},

			invalidatesTags: cacheUtils.invalidatesList(ApiTags.Boards),
		}),

		deleteBoard: builder.mutation<void, Pick<iBoard, "id">>({
			query: ({ id }) => ({
				url: `/boards/${id}`,
				method: "DELETE",
			}),

			onQueryStarted: async ({ id }, { dispatch, queryFulfilled }) => {
				const patchResult = dispatch(
					boardService.util.updateQueryData("getUserBoards", id, boards => {
						const index = boards.findIndex(board => board.id === id);

						if (index) {
							boards.splice(index, 1);
						}
					})
				);

				try {
					await queryFulfilled;
				} catch (e) {
					patchResult.undo();
				}
			},
		}),
	}),
});

export const {
	useGetBoardQuery,
	useAddBoardMutation,
	useEditBoardMutation,
	useDeleteBoardMutation,
	useLazyGetUserBoardsQuery,
	useGetUserBoardsQuery,
} = boardService;

export default boardService;
