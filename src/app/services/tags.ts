import cacheUtils from "../../utils/cacheUtils";
import { iBoard, iCard, iTag } from "../../utils/models";
import api, { ApiTags } from "./api";

const tagService = api.injectEndpoints({
    endpoints: builder => ({
        createTag: builder.mutation<iTag, Pick<iTag, "boardId" | "name">>({
            query: ({ boardId, name }) => ({
                url: `/tags`,
                method: "POST",
                body: {
                    boardId,
                    name,
                },
            }),

            invalidatesTags: cacheUtils.invalidatesList(ApiTags.Boards),
        }),

        assignTagsToCard: builder.mutation<void, { tagIds: iTag["id"][]; cardId: iTag["id"] }>({
            query: ({ tagIds, cardId }) => ({
                url: `/cards/${cardId}/tags`,
                method: "POST",
                body: {
                    tagIds: tagIds,
                },

                invalidatesTags: cacheUtils.invalidatesList(ApiTags.Cards),
            }),
        }),
    }),
});

export const { useCreateTagMutation, useAssignTagsToCardMutation } = tagService;
