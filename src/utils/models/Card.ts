import { iChecklist, iChecklistItem } from "./components/Checklist";
import { iComment } from "./components/Comment";
import { iNotepad } from "./components/Notepad";
import { iTag } from "./components/Tag";

export interface iCard {
    id: string;
    folderId: string;
    name: string;
    description: string;
    dueDate?: Date;
    checklists: iChecklist[];
    notepads: iNotepad[];
    tags: iTag[];
    comments: iComment[];
}
