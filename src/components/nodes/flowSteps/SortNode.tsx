import useComponentVisible from "@/hooks/useComponentIsVisible";
import { RootState } from "@/store";
import { deleteNodeData, IDataStateNode, setNodeData } from "@/store/dataSlice";
import { deleteNode, toggleSelected } from "@/store/editorSlice";
import { openModal } from "@/store/modalPreviewSlice";
import { CollectionHandler } from "@/util/collectionHandler";
import { memo, useCallback, useLayoutEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIncomers, Handle, NodeProps, Position } from "reactflow";

const SortNode = ({ selected, isConnectable, id, data }: NodeProps) => {
  const dispatch = useDispatch();
  const {
    isComponentVisible: isDropdownComponentVisible,
    ref: dropdownRef,
    setIsComponentVisible: setDropdownIsComponentVisible,
  } = useComponentVisible(false);
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
  const ref = useRef<HTMLInputElement>(null);

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

  const handleItemNameCheck = (desc: boolean, index: number) => {
    const newNodeData = structuredClone(nodeData) as IDataStateNode;

    newNodeData.sort[index] = {
      ...newNodeData.sort[index],
      desc,
    };

    const fields = newNodeData.sort.map((col) =>
      col.desc ? `-${col.name}` : col.name
    );

    newNodeData.output = CollectionHandler.sort(
      nodeData?.output as any[],
      fields
    );

    dispatch(setNodeData(newNodeData));
  };

  const addSort = (col: string) => {
    const newNodeData = structuredClone(nodeData) as IDataStateNode;

    newNodeData.sort.push({ name: col, desc: false });

    const fields = newNodeData.sort.map((col) =>
      col.desc ? `-${col.name}` : col.name
    );

    newNodeData.output = CollectionHandler.sort(
      nodeData?.output as any[],
      fields
    );

    dispatch(setNodeData(newNodeData));
  };

  const deleteSort = (col: string) => {
    const newNodeData = structuredClone(nodeData) as IDataStateNode;

    newNodeData.sort.splice(newNodeData.sort.findIndex((q) => q.name === col));

    dispatch(setNodeData(newNodeData));
  };

  return (
    <div
      onMouseEnter={() =>
        dispatch(toggleSelected({ nodeId: id, selected: true }))
      }
      className="flex items-center justify-center relative block bg-cyan-700 hover:bg-cyan-600 border-cyan-500 border rounded-md shadow-lg"
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
                    title: "Data Preview",
                    data: nodeData as IDataStateNode,
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
            {!!data?.output?.length && (
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
            <button
              onClick={() => setDropdownIsComponentVisible(true)}
              type="button"
              className="text-white border border-green-600 bg-green-700 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-400 font-medium rounded-full text-sm p-2 text-center mr-2 mb-2"
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
                  d="M12 6v12m6-6H6"
                />
              </svg>
              <span className="sr-only">Icon description</span>
            </button>
            {isDropdownComponentVisible && (
              <div
                ref={dropdownRef}
                className="absolute z-50 bg-gray-800 text-gray-50 p-2 rounded-lg"
              >
                <ul className="max-h-128 w-64 overflow-auto">
                  {(
                    incomerData?.columns.filter(
                      (col) =>
                        !nodeData?.sort?.some(
                          (sort) => col?.originalName === sort?.name
                        )
                    ) || []
                  ).map((col, index) => (
                    <li
                      onClick={() => addSort(col.originalName)}
                      className="hover:bg-gray-700 p-1 rounded-lg"
                      key={`add-item-${col}-${index}`}
                    >
                      {col.newName}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>

      <div className="block rounded-lg p-2 w-64 space-y-1">
        <div className="relative flex justify-between">
          <p className="text-white">Sort Node</p>
        </div>
        {!!nodeData?.sort.length && (
          <ul className="bg-cyan-800 hover:bg-cyan-700 rounded-lg p-2 space-y-2">
            {nodeData?.sort.map((sortItem, index) => (
              <li
                key={`sort-${sortItem}-${index}-${id}`}
                className="text-base text-gray-50"
              >
                <div className="flex w-full items-center justify-between">
                  {
                    incomerData?.columns.find(
                      (q) => q.originalName === sortItem.name
                    )?.newName
                  }
                  <div className="space-x-2">
                    {sortItem.desc && (
                      <button
                        onClick={() => handleItemNameCheck(false, index)}
                        type="button"
                        className="text-white border border-teal-600 bg-teal-700 hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-400 font-medium rounded-full text-sm p-1 text-center"
                      >
                        <svg
                          className="w-4 h-4"
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
                            d="M4.5 15.75l7.5-7.5 7.5 7.5"
                          />
                        </svg>
                        <span className="sr-only">Icon description</span>
                      </button>
                    )}
                    {!sortItem.desc && (
                      <button
                        onClick={() => handleItemNameCheck(true, index)}
                        type="button"
                        className="text-white border border-teal-600 bg-teal-700 hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-400 font-medium rounded-full text-sm p-1 text-center"
                      >
                        <svg
                          className="w-4 h-4"
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
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                        <span className="sr-only">Icon description</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        deleteSort(sortItem.name);
                      }}
                      type="button"
                      className="text-white border border-red-500 bg-red-600 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-1 text-center"
                    >
                      <svg
                        className="w-4 h-4"
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
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

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

export default memo(SortNode);
