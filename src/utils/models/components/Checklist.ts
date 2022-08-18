import { iComponent } from ".";

export interface iChecklist extends iComponent {
	name: string;
	description: string;
	items: iChecklistItem[];
}

export interface iChecklistItem {
	id: string;
	checklistId: string;
	name: string;
	checked: boolean;
}
