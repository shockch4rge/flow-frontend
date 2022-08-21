import cacheUtils from "../../utils/cacheUtils";
import { iComment } from "../../utils/models";
import { uuid } from "../../utils/uuid";
import api, { ApiTags } from "./api";
import cardService from "./cards";

const commentService = api.injectEndpoints({
    endpoints: builder => ({
        addComment: builder.mutation<void, Pick<iComment, "authorId" | "cardId" | "content">>({
            query: ({ cardId, content, authorId }) => ({
                url: `/comments`,
                method: "POST",
                body: { cardId, content, authorId },
            }),

            onQueryStarted: async ({ cardId, content }, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    cardService.util.updateQueryData("getFolderCards", cardId, cards => {
                        const card = cards.find(c => c.id === cardId);
                        if (!card) return;

                        card.comments.push({
                            cardId,
                            content,
                            id: uuid(),
                            authorId: uuid(),
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

        editComment: builder.mutation<
            void,
            Pick<iComment, "id" | "cardId"> & Partial<Pick<iComment, "content">>
        >({
            query: ({ id, content }) => ({
                url: `/comments/${id}`,
                method: "PUT",
                body: { content },
            }),

            onQueryStarted: async ({ id, cardId, content = "" }, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    cardService.util.updateQueryData("getFolderCards", cardId, cards => {
                        const card = cards.find(c => c.id === cardId);
                        if (!card) return;

                        const notepad = card.comments.find(n => n.id === id);
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

        deleteComment: builder.mutation<void, Pick<iComment, "id" | "cardId">>({
            query: ({ id }) => ({
                url: `/comments/${id}`,
                method: "DELETE",
            }),

            onQueryStarted: async ({ id, cardId }, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    cardService.util.updateQueryData("getFolderCards", cardId, cards => {
                        const card = cards.find(c => c.id === cardId);
                        if (!card) return;

                        Object.assign(card, {
                            comments: card.comments.filter(n => n.id !== id),
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
    }),
});

export const { useAddCommentMutation, useEditCommentMutation, useDeleteCommentMutation } =
    commentService;

export default commentService;
