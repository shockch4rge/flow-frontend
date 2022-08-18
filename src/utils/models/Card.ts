export interface iCard {
	id: string;
	folderId: string;
	name: string;
	description: string;
	dueDate?: Date;
	checklists: [];
	notepads: [];
	tags: [];
	
}
