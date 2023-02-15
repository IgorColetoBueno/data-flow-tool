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
  edges: [
    { id: "e1-2", source: "1", target: "2" },
    { id: "e2-3", source: "2", target: "3" },
  ],
  nodes: [
    {
      id: "1",
      type: "input",
      data: { label: "Input" },
      position: { x: 250, y: 25 },
    },

    {
      id: "2",
      data: { label: "Default" },
      position: { x: 100, y: 125 },
    },
    {
      id: "3",
      type: "output",
      data: { label: "Output" },
      position: { x: 250, y: 250 },
    },
  ],
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
      state.edges = addEdge(action.payload, state.edges);
    },
    addNode(state, action: PayloadAction<Node>) {
      state.nodes.push(action.payload);
    },
    deleteNode(state, action: PayloadAction<string>) {
      state.nodes.splice(state.nodes.findIndex((q) => q.id === action.payload));
    },
    toggleSelected(
      state,
      action: PayloadAction<{ nodeId: string; selected: boolean }>
    ) {
      state.nodes = state.nodes.map((node) => {
        if (node.id === action.payload.nodeId) {
          node.selected = true;
        } else {
          node.selected = false;
        }

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
} = slice.actions;

/**
 * Exportando o reducer
 */
export default slice.reducer;
