import { iBoard } from "./";


export interface iUser {
	id: string;
	username: string;
	name: string;
	email: string;
	boards: Record<string, iBoard>;
	// password is left out
	createdAt: Date;
	updatedAt: Date;
}
