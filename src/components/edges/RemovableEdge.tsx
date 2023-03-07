import { deleteNode } from "@/store/editorSlice";
import { XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";
import { useDispatch } from "react-redux";
import { EdgeProps, getBezierPath } from "reactflow";

const foreignObjectSize = 40;

const RemovableEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const dispatch = useDispatch();

  const onEdgeClick = (
    evt: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => {
    evt.stopPropagation();
    dispatch(deleteNode(id));
  };

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={labelX - foreignObjectSize / 2}
        y={labelY - foreignObjectSize / 2}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div>
          <button
            onClick={(event) => onEdgeClick(event, id)}
            type="button"
            className="text-white border border-red-500 bg-red-600 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2 text-center mt-1"
          >
            <XMarkIcon strokeWidth={3} className="w-3 h-3" />
          </button>
        </div>
      </foreignObject>
    </>
  );
};

export default RemovableEdge;
