import { cacher } from "../../utils/cacherUtils";
import { iCard } from "../../utils/models";
import api, { ApiTags } from "./api";


interface AddCardArgs {
	folderId: string;
	name: string;
}

const cards = api.injectEndpoints({
	endpoints: builder => ({
		getFolderCards: builder.query<iCard[], string>({
			query: folderId => ({
				url: `/folders/${folderId}/cards`,
			}),
		}),

		addCard: builder.mutation<void, AddCardArgs>({
			query: ({ folderId, name }) => ({
				url: `/cards`,
				method: "POST",
				body: {
					name,
					folderId,
				},
			}),

			invalidatesTags: cacher.invalidatesList(ApiTags.Cards),
		}),

		deleteCard: builder.mutation<void, string>({
			query: cardId => ({
				url: `/cards/${cardId}`,
				method: "DELETE",
			}),

			invalidatesTags: cacher.invalidatesList(ApiTags.Cards),
		}),

		moveCard: builder.mutation<void, { cardId: string; folderId: string }>({
			query: ({ cardId, folderId }) => ({
				url: `/cards/${cardId}/move`,
				method: "PUT",
				body: { folderId },
			}),

			invalidatesTags: cacher.invalidatesList(ApiTags.Cards),
		}),
	}),
});

export const { useAddCardMutation, useDeleteCardMutation, useGetFolderCardsQuery, useMoveCardMutation } =
	cards;
