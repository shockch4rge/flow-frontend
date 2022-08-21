import { v4 as uuid } from "uuid";

import cacheUtils from "../../utils/cacheUtils";
import { iFolder } from "../../utils/models";
import api, { ApiTags } from "./api";

const folderService = api.injectEndpoints({
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
                    folderService.util.updateQueryData("getBoardFolders", boardId, folders => {
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

        editFolder: builder.mutation<
            void,
            Pick<iFolder, "id" | "boardId"> & Partial<Omit<iFolder, "id" | "boardId">>
        >({
            query: ({ id, name, description }) => ({
                url: `/folders/${id}`,
                method: "PUT",
                body: {
                    name,
                    description,
                },
            }),

            onQueryStarted: async (
                { id, boardId, name, description },
                { dispatch, queryFulfilled }
            ) => {
                const patchResult = dispatch(
                    folderService.util.updateQueryData("getBoardFolders", boardId, folders => {
                        const folder = folders.find(f => f.id === boardId);

                        if (!folder) return;

                        Object.assign(folder, { name, description });
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

        deleteFolder: builder.mutation<void, Pick<iFolder, "id">>({
            query: ({ id }) => ({
                url: `/folders/${id}`,
                method: "DELETE",
            }),

            invalidatesTags: cacheUtils.invalidatesList(ApiTags.Folders),
        }),

        moveFolder: builder.mutation<void, Pick<iFolder, "id" | "boardId"> & { index: number }>({
            query: ({ id, boardId, index }) => ({
                url: `/folders/${id}/move`,
                method: "PUT",
                body: {
                    boardId,
                    index,
                },
            }),

            invalidatesTags: cacheUtils.invalidatesList(ApiTags.Folders),
        }),
    }),
});

export const {
    useGetBoardFoldersQuery,
    useLazyGetBoardFoldersQuery,
    useAddFolderMutation,
    useEditFolderMutation,
    useDeleteFolderMutation,
    useMoveFolderMutation,
} = folderService;

export default folderService;
