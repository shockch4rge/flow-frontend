import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface DrawerState {
    open: boolean;   
}

type DrawerTypes = "main";

const initialState: Record<DrawerTypes, DrawerState> = {
    main: {
        open: false,
    }
}

const drawerSlice = createSlice({
    name: "drawers",
    initialState,
    reducers: {
        openDrawer: (state, action: PayloadAction<DrawerTypes>) => {
            state[action.payload].open = true;
        },

        closeDrawer: (state, action: PayloadAction<DrawerTypes>) => {
            state[action.payload].open = false;
        },
    },
});


export const { openDrawer, closeDrawer } = drawerSlice.actions;
export default drawerSlice;