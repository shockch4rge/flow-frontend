import { iNotepad } from "../../utils/models";
import api from "./api";

const notepadService = api.injectEndpoints({
	endpoints: builder => ({
		addNotepad: builder.mutation<void, Pick<iNotepad, "content">>({
			query: ({ content }) => ({
				url: `/notepads`,
				method: "POST",
				body: { content },
			}),
		}),

		editNotepad: builder.mutation<
			void,
			Pick<iNotepad, "id"> & Partial<Pick<iNotepad, "content">>
		>({
			query: ({ id, content }) => ({
				url: `/notepads/${id}`,
				method: "PUT",
				body: { content },
			}),
		}),

		deleteNotepad: builder.mutation<void, Pick<iNotepad, "id">>({
			query: ({ id }) => ({
				url: `/notepads/${id}`,
				method: "DELETE",
			}),
		}),
	}),
});

export const { useAddNotepadMutation, useEditNotepadMutation, useDeleteNotepadMutation } =
	notepadService;

export default notepadService;
