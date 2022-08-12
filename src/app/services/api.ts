import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import cacheUtils from "../../utils/cacheUtils";

export const ApiTags = {
	Boards: "Boards",
	Folders: "Folders",
	Cards: "Cards",
};

const api = createApi({
	reducerPath: "api",
	baseQuery: fetchBaseQuery({
		baseUrl: "http://localhost:8000/api",
	}),
	// compose endpoints later
	endpoints: () => ({}),
	tagTypes: [...cacheUtils.defaultTags, ApiTags.Boards, ApiTags.Folders, ApiTags.Cards],
});

export const authHeaders = (token: string) => {
	return {
		Authorization: `Bearer ${token}`,
	};
};

export default api;
