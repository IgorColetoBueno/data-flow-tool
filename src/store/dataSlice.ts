import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IDataStateNodeSort {
  name: string;
  desc: boolean;
}

export interface IDataStateNodeColumn {
  originalName: string;
  newName?: string;
  checked: boolean;
}

export interface IDataStateNode {
  id: string;
  fileName?: string;
  output: any[];
  columns: IDataStateNodeColumn[];
  sort: IDataStateNodeSort[];
  group: string[];
}

interface IDataState {
  nodes: IDataStateNode[];
}

/**
 * Estado inicial do slice
 */
const initialState: IDataState = {
  nodes: [],
};

/**
 * Criando slice da home
 */
const slice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setNodeData(state, action: PayloadAction<IDataStateNode>) {
      const index = state.nodes.findIndex((q) => q.id === action.payload.id);

      if (index < 0) {
        state.nodes.push(action.payload);
      } else {
        state.nodes[index] = action.payload;
      }
    },
    deleteNodeData(state, action: PayloadAction<string>) {
      const index = state.nodes.findIndex((q) => q.id === action.payload);

      state.nodes.splice(index);
    },
  },
});

/**
 * Exportando actions
 */
export const { setNodeData, deleteNodeData } = slice.actions;

/**
 * Exportando o reducer
 */
export default slice.reducer;
