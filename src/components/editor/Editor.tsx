"use client";
import RemovableEdge from "@/components/edges/RemovableEdge";
import ModalPreview from "@/components/modals/ModalPreview";
import GroupNode from "@/components/nodes/flowSteps/GroupNode";
import SelectNode from "@/components/nodes/flowSteps/SelectNode";
import SortNode from "@/components/nodes/flowSteps/SortNode";
import InputNode from "@/components/nodes/input/InputNode";
import { RootState } from "@/store";
import {
  addNode,
  onConnect,
  onEdgesChange,
  onNodesChange,
} from "@/store/editorSlice";
import { generateUUID } from "@/util/generateUUID";
import { ComponentType, DragEvent, useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux/es/exports";
import {
  Background,
  Controls,
  EdgeTypes,
  MiniMap,
  Node,
  NodeProps,
  ReactFlow,
  ReactFlowInstance,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import LineChartNode from "../nodes/output/LineChartNode";
import ReportNode from "../nodes/output/ReportNode";

export type DftNodeTypes =
  | "inputNode"
  | "sortNode"
  | "selectNode"
  | "groupNode"
  | "outputNode"
  | "reportNode"
  | "lineChartNode";

export interface IDftNodes {
  inputNode: ComponentType<NodeProps<any>>;
  sortNode: ComponentType<NodeProps<any>>;
  selectNode: ComponentType<NodeProps<any>>;
  groupNode: ComponentType<NodeProps<any>>;
  outputNode: ComponentType<NodeProps<any>>;
  reportNode: ComponentType<NodeProps<any>>;
  lineChartNode: ComponentType<NodeProps<any>>;
}

const nodeTypes: IDftNodes = {
  inputNode: InputNode,
  sortNode: SortNode,
  selectNode: SelectNode,
  groupNode: GroupNode,
  outputNode: GroupNode,
  reportNode: ReportNode,
  lineChartNode: LineChartNode,
};

const edgeTypes: EdgeTypes = {
  removableEdge: RemovableEdge,
};

const Editor = () => {
  const editorState = useSelector((q: RootState) => q.editor);
  const dispatch = useDispatch();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance<any, any>>();

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (
        typeof type === "undefined" ||
        !type ||
        !reactFlowInstance ||
        !reactFlowBounds
      ) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode: Node = {
        id: generateUUID(),
        type,
        position,
        data: null,
      };

      dispatch(addNode(newNode));
    },
    [dispatch, reactFlowInstance]
  );

  return (
    <ReactFlowProvider>
      <div className="h-full w-full" ref={reactFlowWrapper}>
        <ReactFlow
          className="bg-slate-700"
          nodes={editorState.nodes}
          edges={editorState.edges}
          onNodesChange={(payload) => dispatch(onNodesChange(payload))}
          onEdgesChange={(payload) => dispatch(onEdgesChange(payload))}
          onConnect={(payload) => dispatch(onConnect(payload))}
          fitView
          defaultViewport={{ x: 0, y: 0, zoom: 1.5 }}
          nodeTypes={nodeTypes as any}
          edgeTypes={edgeTypes}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setReactFlowInstance}
        >
          <Background />
          <Controls className="bg-sky-900 fill-gray-50" />
          <MiniMap
            className="bg-sky-900"
            nodeStrokeWidth={5}
            zoomable
            pannable
          />
        </ReactFlow>

        <ModalPreview />
      </div>
    </ReactFlowProvider>
  );
};

export default Editor;
