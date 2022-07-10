import { iComponent } from "./";


export interface iChecklist extends iComponent {
	items: iChecklistItem[];
}

export interface iChecklistItem {
	id: string;
	checklistId: string;
	name: string;
	checked: boolean;
	dueDate?: Date;
}
