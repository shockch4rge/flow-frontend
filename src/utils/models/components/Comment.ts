import { iComponent } from "./Component";

export interface iComment extends iComponent {
    authorId: string;
    content: string;
}