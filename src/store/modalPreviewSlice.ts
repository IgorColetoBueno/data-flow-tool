import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IDataStateNode } from "./dataSlice";

type ModalPreviewState = {
  title: string;
  data: IDataStateNode | null;
  open?: boolean;
};

/**
 * Estado inicial do slice
 */
const initialState: ModalPreviewState = {
  title: "",
  data: null,
  open: false,
};

/**
 * Criando slice da home
 */
const slice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    openModal(state, action: PayloadAction<ModalPreviewState>) {
      state.open = true;
      state.data = action.payload.data;
      state.title = action.payload.title;
    },
    closeModal(state) {
      state.open = false;
      state.data = null;
      state.title = "";
    },
  },
});

/**
 * Exportando actions
 */
export const { closeModal, openModal } = slice.actions;

/**
 * Exportando o reducer
 */
export default slice.reducer;
