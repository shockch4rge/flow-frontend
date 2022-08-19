import cacheUtils from "../../utils/cacheUtils";
import { iChecklist, iChecklistItem } from "../../utils/models";
import api, { ApiTags } from "./api";

const checklistService = api.injectEndpoints({
    endpoints: builder => ({
        addChecklist: builder.mutation<void, Pick<iChecklist, "cardId" | "name" | "description">>({
            query: ({ cardId, name, description }) => ({
                url: `/checklists`,
                method: "POST",
                body: { cardId, name, description },
            }),

            invalidatesTags: cacheUtils.invalidatesList(ApiTags.Cards),
        }),

        editChecklist: builder.mutation<void, Pick<iChecklist, "id" | "name" | "description">>({
            query: ({ id, name, description }) => ({
                url: `/checklists/${id}`,
                method: "PUT",
                body: { name, description },
            }),

            invalidatesTags: cacheUtils.invalidatesList(ApiTags.Cards),
        }),

        deleteChecklist: builder.mutation<void, Pick<iChecklist, "id">>({
            query: ({ id }) => ({
                url: `/checklists/${id}`,
                method: "DELETE",
            }),

            invalidatesTags: cacheUtils.invalidatesList(ApiTags.Cards),
        }),

        addChecklistItem: builder.mutation<void, Pick<iChecklist, "id" | "name">>({
            query: ({ id, name }) => ({
                url: `/checklist_items`,
                method: "POST",
                body: { name },
            }),

            invalidatesTags: cacheUtils.invalidatesList(ApiTags.Cards),
        }),

        deleteChecklistItem: builder.mutation<void, Pick<iChecklistItem, "id">>({
            query: ({ id }) => ({
                url: `/checklist_items/${id}`,
                method: "DELETE",
            }),

            invalidatesTags: cacheUtils.invalidatesList(ApiTags.Cards),
        }),

        toggleChecklistItem: builder.mutation<void, Pick<iChecklistItem, "id">>({
            query: ({ id }) => ({
                url: `/checklist_items/${id}/toggle`,
                method: "PUT",
            }),

            invalidatesTags: cacheUtils.invalidatesList(ApiTags.Cards),
        }),
    }),
});

export const { 
    useAddChecklistMutation,
    useDeleteChecklistMutation,
    useAddChecklistItemMutation,
    useDeleteChecklistItemMutation,
    useToggleChecklistItemMutation,
} = checklistService;

export default checklistService;