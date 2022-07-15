import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import cacheUtils from "../../utils/cacheUtils";


export const ApiTags = {
	Users: "Users",
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
	tagTypes: [...cacheUtils.defaultTags, ApiTags.Users, ApiTags.Boards, ApiTags.Folders, ApiTags.Cards],
});

export default api;
