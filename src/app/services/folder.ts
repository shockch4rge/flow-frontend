import { iFolder } from "../../utils/models";
import api from "./api";


const folders = api.injectEndpoints({
	endpoints: builder => ({
		getBoardFolders: builder.query<iFolder[], string>({
			query: boardId => ({
				url: `/boards/${boardId}/folders`,
				method: "get",
			}),
		}),

		addFolder: builder.mutation<void, iFolder>({
			query: folder => ({
				url: `/folders`,
				method: "POST",
				body: folder,
			}),
		}),
	}),
});

export const { useGetBoardFoldersQuery, useAddFolderMutation } = folders;