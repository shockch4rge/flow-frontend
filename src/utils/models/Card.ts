import { iComponent } from "./Component";


export interface iCard {
	id: string;
	folderId: string;
	name: string;
	description: string;
	components: iComponent[];
}
