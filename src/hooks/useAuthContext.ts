import { useContext } from "react";
import { AuthContext } from "../app/context/AuthContext";

export const useAuthContext = () => {
	return useContext(AuthContext)!;
};
