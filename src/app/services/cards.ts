import cacheUtils from "../../utils/cacheUtils";
import { iCard } from "../../utils/models";
import api, { ApiTags } from "./api";


const cards = api.injectEndpoints({
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

			invalidatesTags: cacheUtils.invalidatesList(ApiTags.Cards),
		}),

		deleteCard: builder.mutation<void, iCard["id"]>({
			query: cardId => ({
				url: `/cards/${cardId}`,
				method: "DELETE",
			}),

			invalidatesTags: cacheUtils.invalidatesList(ApiTags.Cards),
		}),

		moveCard: builder.mutation<void, Pick<iCard, "id" | "folderId">>({
			query: ({ id: cardId, folderId }) => ({
				url: `/cards/${cardId}/move`,
				method: "PUT",
				body: { folderId },
			}),

			invalidatesTags: cacheUtils.invalidatesList(ApiTags.Cards),
		}),
	}),
});

export const { useAddCardMutation, useDeleteCardMutation, useGetFolderCardsQuery, useMoveCardMutation } =
	cards;
