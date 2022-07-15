import cacheUtils from "../../utils/cacheUtils";
import { iFolder } from "../../utils/models";
import api, { ApiTags } from "./api";


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

			invalidatesTags: cacheUtils.invalidatesList(ApiTags.Folders),
		}),
	}),
});

export const { useGetBoardFoldersQuery, useAddFolderMutation } = folders;
