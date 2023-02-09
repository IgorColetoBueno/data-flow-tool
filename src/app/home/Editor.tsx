"use client";
import { RootState } from "@/store";
import { onConnect, onEdgesChange, onNodesChange } from "@/store/editorSlice";
import { useDispatch, useSelector } from "react-redux/es/exports";
import { ReactFlow, Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

const Editor = () => {
  const editorState = useSelector((q: RootState) => q.editor);
  const dispatch = useDispatch();
  return (
    <ReactFlow
      nodes={editorState.nodes}
      edges={editorState.edges}
      onNodesChange={(payload) => dispatch(onNodesChange(payload))}
      onEdgesChange={(payload) => dispatch(onEdgesChange(payload))}
      onConnect={(payload) => dispatch(onConnect(payload))}
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
};

export default Editor;
