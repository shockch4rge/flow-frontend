import cacheUtils from "../../utils/cacheUtils";
import { iNotepad } from "../../utils/models";
import { uuid } from "../../utils/uuid";
import api, { ApiTags } from "./api";
import cardService from "./cards";

const notepadService = api.injectEndpoints({
    endpoints: builder => ({
        addNotepad: builder.mutation<void, Pick<iNotepad, "cardId" | "content">>({
            query: ({ cardId, content }) => ({
                url: `/notepads`,
                method: "POST",
                body: { cardId, content },
            }),

            onQueryStarted: async ({ cardId, content }, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    cardService.util.updateQueryData("getFolderCards", cardId, cards => {
                        const card = cards.find(c => c.id === cardId);
                        if (!card) return;

                        card.notepads.push({
                            cardId,
                            content,
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

        editNotepad: builder.mutation<
            void,
            Pick<iNotepad, "id" | "cardId"> & Partial<Pick<iNotepad, "content">>
        >({
            query: ({ id, content }) => ({
                url: `/notepads/${id}`,
                method: "PUT",
                body: { content },
            }),

            onQueryStarted: async ({ id, cardId, content = "" }, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    cardService.util.updateQueryData("getFolderCards", cardId, cards => {
                        const card = cards.find(c => c.id === cardId);
                        if (!card) return;

                        const notepad = card.notepads.find(n => n.id === id);
                        if (!notepad) return;

                        Object.assign(notepad, { content });
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

        deleteNotepad: builder.mutation<void, Pick<iNotepad, "id" | "cardId">>({
            query: ({ id }) => ({
                url: `/notepads/${id}`,
                method: "DELETE",
            }),

            onQueryStarted: async ({ id, cardId }, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    cardService.util.updateQueryData("getFolderCards", cardId, cards => {
                        const card = cards.find(c => c.id === cardId);
                        if (!card) return;

                        Object.assign(card, {
							notepads: card.notepads.filter(n => n.id !== id),
						})
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
    }),
});

export const { useAddNotepadMutation, useEditNotepadMutation, useDeleteNotepadMutation } =
    notepadService;

export default notepadService;
