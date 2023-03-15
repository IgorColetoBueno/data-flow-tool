import { RootState } from "@/store";
import { deleteNodeData, setNodeData } from "@/store/dataSlice";
import { deleteNode, toggleSelected } from "@/store/editorSlice";
import { EyeIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { memo, useCallback, useLayoutEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIncomers, Handle, NodeProps, Position } from "reactflow";

const SortNode = ({ selected, isConnectable, id, data }: NodeProps) => {
  const dispatch = useDispatch();
  const editor = useSelector((state: RootState) => state.editor);
  const node = editor.nodes.find((q) => q.id === id);
  const nodeData = useSelector((state: RootState) =>
    state.data.nodes.find((q) => q.id === id)
  );
  const incomer = useMemo(() => {
    if (!node) {
      return null;
    }

    return getIncomers(node, editor.nodes, editor.edges)[0];
  }, [editor.edges, editor.nodes, node]);

  const incomerData = useSelector((state: RootState) =>
    state.data.nodes.find((node) => node.id === incomer?.id)
  );

  const resetData = useCallback(() => {
    if (!incomerData) return;

    dispatch(
      setNodeData({
        ...incomerData,
        id,
      })
    );
  }, [dispatch, id, incomerData]);

  useLayoutEffect(() => {
    if (!incomerData || !!nodeData) {
      return;
    }

    resetData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id, incomerData, resetData]);

  return (
    <div
      onMouseEnter={() =>
        dispatch(toggleSelected({ nodeId: id, selected: true }))
      }
      className="flex items-center justify-center relative block bg-sky-700 hover:bg-sky-600 border-sky-500 border rounded-md shadow-lg"
    >
      <Handle
        type="target"
        position={Position.Left}
        id="a"
        className="h-4 w-2 -left-3 !bg-amber-500 border-none rounded-sm"
        isConnectable={isConnectable}
      />
      <div style={{ top: -40 }} className="absolute w-fit">
        {selected && (
          <div className="flex align-center">
            <div>
              <button
                onClick={() => {
                  dispatch(deleteNode(id));
                  dispatch(deleteNodeData(id));
                }}
                type="button"
                className="text-white border border-red-500 bg-red-600 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2 text-center mr-2 mb-2"
              >
                <XMarkIcon strokeWidth={3} className="w-3 h-3" />
              </button>
            </div>
            <Link
              target="_blank"
              href={`/home/${editor.boardId}/report/${id}`}
              type="button"
              className="text-white border border-sky-500 bg-sky-600 hover:bg-sky-500 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-full text-sm p-2 text-center mr-2 mb-2"
            >
              <EyeIcon className="w-3 h-3" />
            </Link>
          </div>
        )}
      </div>

      <div className="block rounded-lg p-2 w-64 space-y-1">
        <div className="relative flex justify-between">
          <p className="text-white">Report</p>
        </div>
      </div>
    </div>
  );
};

export default memo(SortNode);
