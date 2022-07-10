import { cacher } from "../../utils/cacherUtils";
import { iCard } from "../../utils/models";
import api, { ApiTags } from "./api";


const cards = api.injectEndpoints({
	endpoints: builder => ({
		getFolderCards: builder.query<iCard[], string>({
			query: folderId => ({
				url: `/folders/${folderId}/cards`,
			}),
		}),

		addCard: builder.mutation<void, iCard>({
			query: card => ({
				url: `/cards`,
				method: "POST",
				body: card,
			}),

			invalidatesTags: cacher.invalidatesList(ApiTags.Cards),
		}),

		moveToFolder: builder.mutation<void, { cardId: string; folderId: string }>({
			query: ({ cardId, folderId }) => ({
				url: `/cards/${cardId}/move`,
				method: "PUT",
				body: { folderId },
			}),

			invalidatesTags: cacher.invalidatesList(ApiTags.Cards),
		}),
	}),
});

export const { useAddCardMutation, useGetFolderCardsQuery, useMoveToFolderMutation } = cards;
