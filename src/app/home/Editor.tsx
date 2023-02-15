"use client";
import InputNode from "@/components/InputNode";
import { RootState } from "@/store";
import { onConnect, onEdgesChange, onNodesChange } from "@/store/editorSlice";
import { useDispatch, useSelector } from "react-redux/es/exports";
import { Background, Controls, MiniMap, NodeTypes, ReactFlow } from "reactflow";
import "reactflow/dist/style.css";

const nodeTypes: NodeTypes = {
  inputNode: InputNode,
};

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
      fitView
      defaultViewport={{ x: 0, y: 0, zoom: 1.5 }}
      nodeTypes={nodeTypes}
    >
      <Background />
      <Controls />
      <MiniMap nodeStrokeWidth={5} zoomable pannable />
    </ReactFlow>
  );
};

export default Editor;
