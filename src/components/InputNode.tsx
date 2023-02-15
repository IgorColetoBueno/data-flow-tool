import { deleteNode, toggleSelected } from "@/store/editorSlice";
import { memo, useRef } from "react";
import { useDispatch } from "react-redux";
import { Handle, NodeProps, Position } from "reactflow";

const InputNode = ({ selected, isConnectable, id }: NodeProps) => {
  const dispatch = useDispatch();
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center justify-center w-72 relative block bg-indigo-700 hover:bg-indigo-600 border-indigo-500 border rounded-md shadow-lg">
      <div style={{ top: -40 }} className="absolute w-fit">
        {selected && (
          <>
            <button
              onClick={() => dispatch(deleteNode(id))}
              type="button"
              className="text-red-700 hover:text-white border border-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2 text-center mr-2 mb-2"
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
              onClick={() => {
                if (!ref.current) {
                  return;
                }
                ref.current.value = "";
              }}
              type="button"
              className="text-slate-500 hover:text-white border border-slate-500 hover:bg-slate-500 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2 text-center mr-2 mb-2"
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
          </>
        )}
      </div>

      <label
        className="block bg-indigo-700 hover:bg-indigo-600 rounded-lg w-full"
        onMouseEnter={() =>
          dispatch(toggleSelected({ nodeId: id, selected: true }))
        }
      >
        <input
          ref={ref}
          type="file"
          accept=".json"
          className="block w-full text-xs text-slate-50
      file:mr-4 file:py-5 file:px-2
      file:rounded-full file:border-0
      file:text-xs file:font-semibold
      file:bg-indigo-700 file:hover:bg-indigo-600 file:text-gray-50
      hover:file:text-gray-200
    "
        />
      </label>
      {/* <label
        onMouseEnter={() =>
          dispatch(toggleSelected({ nodeId: id, selected: true }))
        }
        htmlFor="dropzone-file"
        style={{ padding: "10px" }}
        className="flex flex-col items-center justify-center w-full h-128 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-800 bg-indigo-700 border-gray-600 hover:border-gray-400 hover:bg-indigo-700"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            style={{ height: "25px" }}
            aria-hidden="true"
            className="w-10 text-gray-100"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
          <p className="my-2 px-2 text-sm text-gray-100">
            Click here to upload
          </p>
        </div>
        <input id="dropzone-file" type="file" className="hidden" />
      </label> */}

      <Handle
        type="source"
        position={Position.Right}
        id="a"
        className="h-4 w-2 -right-3 !bg-indigo-500 border-none rounded-sm"
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default memo(InputNode);
