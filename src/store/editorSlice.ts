import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
} from "reactflow";

type RFState = {
  nodes: Node[];
  edges: Edge[];
};

/**
 * Estado inicial do slice
 */
const initialState: RFState = {
  edges: [],
  nodes: [],
};

/**
 * Criando slice da home
 */
const slice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    onNodesChange(state, action: PayloadAction<NodeChange[]>) {
      state.nodes = applyNodeChanges(action.payload, state.nodes);
    },
    onEdgesChange(state, action: PayloadAction<EdgeChange[]>) {
      state.edges = applyEdgeChanges(action.payload, state.edges);
    },
    onConnect(state, action: PayloadAction<Connection>) {
      state.edges = addEdge(
        { ...action.payload, type: "removableEdge" },
        state.edges
      );
    },
    addNode(state, action: PayloadAction<Node>) {
      state.nodes.push(action.payload);
    },
    deleteNode(state, action: PayloadAction<string>) {
      const index = state.nodes.findIndex((q) => q.id === action.payload);
      state.nodes.splice(index, 1);
    },
    deleteEdge(state, action: PayloadAction<string>) {
      const index = state.edges.findIndex((q) => q.id === action.payload);
      state.edges.splice(index, 1);
    },
    toggleSelected(
      state,
      action: PayloadAction<{ nodeId: string; selected: boolean }>
    ) {
      state.nodes = state.nodes.map((node) => {
        node.selected = node.id === action.payload.nodeId;

        return node;
      });
    },
  },
});

/**
 * Exportando actions
 */
export const {
  onConnect,
  onEdgesChange,
  onNodesChange,
  addNode,
  toggleSelected,
  deleteNode,
  deleteEdge,
} = slice.actions;

/**
 * Exportando o reducer
 */
export default slice.reducer;
