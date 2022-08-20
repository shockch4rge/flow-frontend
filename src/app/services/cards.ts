import { v4 as uuid } from "uuid";

import cacheUtils from "../../utils/cacheUtils";
import { iCard, iTag } from "../../utils/models";
import api, { ApiTags } from "./api";

const cardService = api.injectEndpoints({
    endpoints: builder => ({
        getFolderCards: builder.query<iCard[], iCard["folderId"]>({
            query: folderId => ({
                url: `/folders/${folderId}/cards`,
            }),

            providesTags: cacheUtils.providesList(ApiTags.Cards),
        }),

        addCard: builder.mutation<void, Pick<iCard, "folderId" | "name">>({
            query: ({ folderId, name }) => ({
                url: `/cards`,
                method: "POST",
                body: {
                    name,
                    folderId,
                },
            }),

            onQueryStarted: async ({ folderId, name }, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    cardService.util.updateQueryData("getFolderCards", folderId, cards => {
                        cards.push({
                            checklists: [],
                            notepads: [],
                            tags: [],
                            comments: [],
                            dueDate: undefined,
                            description: "",
                            folderId,
                            name,
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

            invalidatesTags: cacheUtils.invalidatesList(ApiTags.Cards),
        }),

        editCard: builder.mutation<
            void,
            Pick<iCard, "id" | "folderId"> & Partial<Omit<iCard, "id" | "folderId">>
        >({
            query: ({ id, name, description, dueDate }) => ({
                url: `/cards/${id}`,
                method: "PUT",
                body: {
                    name,
                    description,
                    dueDate,
                },
            }),

            onQueryStarted: async (
                { id, folderId, description = "", name = "" },
                { dispatch, queryFulfilled }
            ) => {
                const patchResult = dispatch(
                    cardService.util.updateQueryData("getFolderCards", folderId, cards => {
                        const card = cards.find(card => card.id === id);
                        if (!card) return;

                        Object.assign(card, { name, description });
                    })
                );

                try {
                    await queryFulfilled;
                } catch (e) {
                    patchResult.undo();
                }
            },
        }),

        deleteCard: builder.mutation<void, iCard["id"]>({
            query: cardId => ({
                url: `/cards/${cardId}`,
                method: "DELETE",
            }),

            onQueryStarted: async (cardId, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    cardService.util.updateQueryData("getFolderCards", cardId, cards => {
                        return cards.filter(card => card.id !== cardId);
                    })
                );

                try {
                    await queryFulfilled;
                } catch (e) {
                    patchResult.undo();
                }
            },

            invalidatesTags: cacheUtils.invalidatesList(ApiTags.Cards),
        }),

        moveCard: builder.mutation<void, Pick<iCard, "id" | "folderId"> & { index: number }>({
            query: ({ id: cardId, folderId, index }) => ({
                url: `/cards/${cardId}/move`,
                method: "PUT",
                body: {
                    folderId,
                    index,
                },
            }),

            invalidatesTags: cacheUtils.invalidatesList(ApiTags.Cards),
        }),

        addCardTag: builder.mutation<void, { cardId: iCard["id"]; tagId: iTag["id"] }>({
            query: ({ cardId, tagId }) => ({
                url: `/cards/${cardId}/tags/${tagId}`,
                method: "PUT",
            }),

            invalidatesTags: cacheUtils.invalidatesList(ApiTags.Cards),
        }),

        deleteCardTag: builder.mutation<void, { cardId: iCard["id"]; tagId: iTag["id"] }>({
            query: ({ cardId, tagId }) => ({
                url: `/cards/${cardId}/tags/${tagId}`,
                method: "DELETE",
            }),

            invalidatesTags: cacheUtils.invalidatesList(ApiTags.Cards),
        }),
    }),
});

export const {
    useAddCardMutation,
    useEditCardMutation,
    useDeleteCardMutation,
    useGetFolderCardsQuery,
    useMoveCardMutation,
} = cardService;

export default cardService;
