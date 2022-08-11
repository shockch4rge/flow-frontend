import cacheUtils from "../../utils/cacheUtils";
import { iFolder } from "../../utils/models";
import api, { ApiTags } from "./api";
import { v4 as uuid } from "uuid";

const folders = api.injectEndpoints({
	endpoints: builder => ({
		getBoardFolders: builder.query<iFolder[], iFolder["boardId"]>({
			query: boardId => ({
				url: `/boards/${boardId}/folders`,
				method: "get",
			}),

			providesTags: cacheUtils.providesList(ApiTags.Folders),
		}),

		addFolder: builder.mutation<void, Pick<iFolder, "name" | "boardId">>({
			query: ({ name, boardId }) => ({
				url: `/folders`,
				method: "POST",
				body: {
					name,
					boardId,
				},
			}),

			onQueryStarted: async ({ name, boardId }, { dispatch, queryFulfilled }) => {
				const patchResult = dispatch(
					folders.util.updateQueryData("getBoardFolders", boardId, folders => {
						folders.push({
							name,
							boardId,
							description: "",
							id: uuid(),
						});
					})
				);

				try {
					await queryFulfilled;
				} catch (e) {
					patchResult.undo();
				}
			},

			invalidatesTags: cacheUtils.invalidatesList(ApiTags.Folders),
		}),

		moveFolder: builder.mutation<void, Pick<iFolder, "id"> & { index: number }>({
			query: ({ id, index }) => ({
				url: `/folders/${id}/move`,
				method: "PUT",
				body: {
					index,
				},
			}),

			onQueryStarted: async ({ id, index }, { dispatch, queryFulfilled }) => {
				const patchResult = dispatch(
					folders.util.updateQueryData("getBoardFolders", id, folders => {
						console.log(folders.find(folder => folder.id === id));

						Object.assign(folders.find(folder => folder.id === id)!, index);
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

export const { useGetBoardFoldersQuery, useAddFolderMutation, useMoveFolderMutation } = folders;
