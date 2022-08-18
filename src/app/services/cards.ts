import cacheUtils from "../../utils/cacheUtils";
import { iCard } from "../../utils/models";
import api, { ApiTags } from "./api";
import { v4 as uuid } from "uuid";

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
			Pick<iCard, "id"> & Partial<Omit<iCard, "folderId" | "components">>
		>({
			query: ({ id, name, description }) => ({
				url: `/cards/${id}`,
				method: "PUT",
				body: {
					name,
					description,
				},
			}),

			onQueryStarted: async (
				{ id, description = "", name = "" },
				{ dispatch, queryFulfilled }
			) => {
				const patchResult = dispatch(
					cardService.util.updateQueryData("getFolderCards", id, cards => {
						const card = cards.find(card => card.id === id);

						if (card) {
							card.description = description;
							card.name = name;
						}
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

			onQueryStarted: async ({ id, folderId, index }, { dispatch, queryFulfilled }) => {
				const patchResult = dispatch(
					cardService.util.updateQueryData("getFolderCards", folderId, cards => {
						const card = cards.find(card => card.id === id);

						if (!card) return;
						Object.assign(card, {
							folderId,
							index,
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

export const {
	useAddCardMutation,
	useDeleteCardMutation,
	useGetFolderCardsQuery,
	useMoveCardMutation,
} = cardService;

export default cardService;