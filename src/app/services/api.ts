import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import cacheUtils from "../../utils/cacheUtils";
import { RootState } from "../store";

export const ApiTags = {
	Boards: "Boards",
	Folders: "Folders",
	Cards: "Cards",
	Checklists: "Checklists",
	Notepads: "Notepads",
	Comments: "Comments",
	Tags: "Tags",
};

const api = createApi({
	reducerPath: "api",
	baseQuery: fetchBaseQuery({
		baseUrl: "http://localhost:8000/api",
		headers: {
			Accept: "application/json",
		},
		prepareHeaders: (headers, { getState }) => {
			const token = (getState() as RootState).auth.token;

			if (token) {
				headers.append("Authorization", `Bearer ${token}`);
			}

			return headers;
		},
	}),
	// compose endpoints later
	endpoints: () => ({}),
	tagTypes: [
		...cacheUtils.defaultTags,
		ApiTags.Boards,
		ApiTags.Folders,
		ApiTags.Cards,
		ApiTags.Checklists,
		ApiTags.Notepads,
		ApiTags.Comments,
		ApiTags.Tags,
	],
});

export default api;
