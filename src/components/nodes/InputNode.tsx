import { DatabaseManager } from "@/storage/indexedDbHandler";
import { RootState } from "@/store";
import { deleteNodeData, setNodeData } from "@/store/dataSlice";
import { deleteNode, toggleSelected } from "@/store/editorSlice";
import { openModal } from "@/store/modalPreviewSlice";
import { memo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Handle, NodeProps, Position } from "reactflow";

const InputNode = ({ selected, isConnectable, id }: NodeProps) => {
  const dispatch = useDispatch();
  const nodeData = useSelector((state: RootState) =>
    state.data.nodes.find((q) => q.id === id)
  );
  const ref = useRef<HTMLInputElement>(null);

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files as FileList);

    if (!files.length) {
      return;
    }

    try {
      const strJSON = await (files[0] as any).text();
      const obj: any[] = JSON.parse(strJSON);

      if (!obj.length) return;

      await DatabaseManager.save(obj);

      const output = obj.slice(0, 29);
      const columns = Object.keys(output[0]);

      dispatch(
        setNodeData({
          output,
          fileName: files[0].name,
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
    } catch (error) {
      alert(JSON.stringify(error));
    }
  };

  return (
    <div
      onMouseEnter={() =>
        dispatch(toggleSelected({ nodeId: id, selected: true }))
      }
      className="flex items-center justify-center relative block bg-indigo-700 hover:bg-indigo-600 border-indigo-500 border rounded-md shadow-lg"
    >
      <div style={{ top: -40 }} className="absolute w-fit">
        {selected && (
          <>
            <button
              onClick={() => {
                dispatch(deleteNode(id));
                dispatch(deleteNodeData(id));
              }}
              type="button"
              className="text-white border border-red-500 bg-red-600 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2 text-center mr-2 mb-2"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
              <span className="sr-only">Icon description</span>
            </button>
            <button
              onClick={() =>
                dispatch(
                  openModal({
                    title: "Data Preview (Only the first 30 items)",
                    data: nodeData?.output,
                  })
                )
              }
              type="button"
              className="text-white border border-cyan-500 bg-cyan-600 hover:bg-cyan-500 focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-full text-sm p-2 text-center mr-2 mb-2"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="sr-only">Icon description</span>
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

                  if (!ref.current) {
                    return;
                  }
                  ref.current.value = "";
                }}
                type="button"
                className="text-white border border-slate-500 bg-slate-600 hover:bg-slate-500 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-full text-sm p-2 text-center mr-2 mb-2"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span className="sr-only">Icon description</span>
              </button>
            )}
          </>
        )}
      </div>

      {!nodeData?.fileName && (
        <label className="block bg-indigo-700 hover:bg-indigo-600 rounded-lg w-full w-96">
          <input
            ref={ref}
            type="file"
            accept=".json"
            onChange={handleFileSelected}
            className="block w-full text-xs text-slate-50
      file:mr-4 file:py-5 file:px-2
      file:rounded-full file:border-0
      file:text-xs file:font-semibold
      file:bg-indigo-700 file:hover:bg-indigo-600 file:text-gray-50
      hover:file:text-gray-200
    "
          />
        </label>
      )}
      {!!nodeData?.fileName && (
        <div className="block rounded-lg py-5 w-36">
          <p className="text-white text-center">{nodeData?.fileName}</p>
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
