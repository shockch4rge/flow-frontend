import { iTag } from "./components/Tag";

export interface iBoard {
	id: string;
	name: string;
	description: string;
	authorId: string;
	createdAt: string;
	updatedAt: string;
	tags: iTag[];
}
