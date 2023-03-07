import { EXTERNAL_KEY_BOARD_FROM_EDITOR } from "@/storage";
import { DataDbHandler } from "@/storage/dataDbHandler";
import { RootState } from "@/store";
import {
  clearAllNodeData,
  IDataStateNode,
  setNodeData,
} from "@/store/dataSlice";
import { deleteNode, toggleSelected } from "@/store/editorSlice";
import { openModal } from "@/store/modalPreviewSlice";
import { memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Handle, NodeProps, Position } from "reactflow";
import { IDataWorkerMessage, IWorkerData } from "../../workers/input.worker";
import {
  EyeIcon,
  XMarkIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/solid";

const InputNode = ({ selected, isConnectable, id }: NodeProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const nodeData = useSelector((state: RootState) =>
    state.data.nodes.find((q) => q.id === id)
  );
  const boardId = useSelector((state: RootState) => state.editor.boardId);
  const ref = useRef<HTMLInputElement>(null);
  const workerRef = useRef<Worker>();

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../../workers/input.worker.ts", import.meta.url)
    );

    workerRef.current.onmessage = (event: MessageEvent<IDataWorkerMessage>) => {
      setLoading(false);
      if (event.data.type === "error") {
        alert("Error");
        return;
      }

      const columns = Object.keys(event.data.payload[0]);

      dispatch(
        setNodeData({
          output: event.data.payload,
          fileName: event.data.fileName,
          id,
          columns: columns.map((col) => ({
            checked: true,
            originalName: col,
            newName: col,
          })),
          group: [],
          sort: [],
        })
      );
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, [dispatch, id]);

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files as FileList);

    if (!files.length) {
      return;
    }

    debugger;
    setLoading(true);
    workerRef.current?.postMessage({
      file: files[0],
      key: boardId,
    } as IWorkerData);
  };

  return (
    <div
      onMouseEnter={() =>
        dispatch(toggleSelected({ nodeId: id, selected: true }))
      }
      className="flex items-center justify-center relative block bg-sky-700 hover:bg-sky-600 border-sky-500 border rounded-md shadow-lg"
    >
      <div style={{ top: -40 }} className="absolute w-fit">
        {selected && (
          <>
            <button
              onClick={() => {
                dispatch(deleteNode(id));
                dispatch(clearAllNodeData());
                DataDbHandler.removeByIndex(
                  {
                    index: EXTERNAL_KEY_BOARD_FROM_EDITOR,
                    value: boardId,
                  },
                  window.indexedDB
                );
              }}
              type="button"
              className="text-white border border-red-500 bg-red-600 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2 text-center mr-2 mb-2"
            >
              <XMarkIcon strokeWidth={3} className="w-3 h-3" />
            </button>
            <button
              onClick={() =>
                dispatch(
                  openModal({
                    title: "Data Preview (Only the first 30 items)",
                    data: nodeData!,
                  })
                )
              }
              type="button"
              className="text-white border border-cyan-500 bg-cyan-600 hover:bg-cyan-500 focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-full text-sm p-2 text-center mr-2 mb-2"
            >
              <EyeIcon className="w-3 h-3" />
            </button>
            {!!nodeData?.output?.length && (
              <button
                onClick={() => {
                  dispatch(
                    setNodeData({
                      output: [],
                      fileName: undefined,
                      id,
                      columns: [],
                      group: [],
                      sort: [],
                    })
                  );
                  DataDbHandler.removeByIndex(
                    {
                      index: EXTERNAL_KEY_BOARD_FROM_EDITOR,
                      value: boardId,
                    },
                    window.indexedDB
                  );

                  if (!ref.current) {
                    return;
                  }
                  ref.current.value = "";
                }}
                type="button"
                className="text-white border border-slate-500 bg-slate-600 hover:bg-slate-500 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-full text-sm p-2 text-center mr-2 mb-2"
              >
                <ArrowUturnLeftIcon className="w-3 h-3" />
              </button>
            )}
          </>
        )}
      </div>

      {!loading && !nodeData?.fileName && (
        <label className="block bg-sky-700 hover:bg-sky-600 rounded-lg w-full w-96">
          <input
            ref={ref}
            type="file"
            accept=".json"
            onChange={handleFileSelected}
            className="block w-full text-xs text-slate-50
      file:mr-4 file:py-5 file:px-2
      file:rounded-full file:border-0
      file:text-xs file:font-semibold
      file:bg-sky-700 file:hover:bg-sky-600 file:text-gray-50
      hover:file:text-gray-200
    "
          />
        </label>
      )}
      {!loading && !!nodeData?.fileName && (
        <div className="block rounded-lg py-5 w-36">
          <p className="text-white text-center">{nodeData?.fileName}</p>
        </div>
      )}
      {loading && (
        <div className="block rounded-lg py-5 w-36">
          <p className="text-white text-center">Loading...</p>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        id="a"
        className="h-4 w-2 -right-3 !bg-amber-500 border-none rounded-sm"
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default memo(InputNode);
