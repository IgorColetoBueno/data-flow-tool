import useComponentVisible from "@/hooks/useComponentIsVisible";
import { RootState } from "@/store";
import { deleteNodeData, IDataStateNode, setNodeData } from "@/store/dataSlice";
import { deleteNode, toggleSelected } from "@/store/editorSlice";
import { openModal } from "@/store/modalPreviewSlice";
import { CollectionHandler } from "@/util/collectionHandler";
import { EyeIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { memo, useCallback, useLayoutEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIncomers, Handle, NodeProps, Position } from "reactflow";

const GroupNode = ({ selected, isConnectable, id, data }: NodeProps) => {
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

  const addGroup = (col: string) => {
    const newNodeData = structuredClone(nodeData) as IDataStateNode;

    newNodeData.group.push(col);

    newNodeData.output = CollectionHandler.group(
      incomerData?.output as any[],
      newNodeData.group,
      incomerData!.sort
    );

    dispatch(setNodeData(newNodeData));
  };

  const deleteSort = (col: string) => {
    const newNodeData = structuredClone(nodeData) as IDataStateNode;

    newNodeData.group.splice(newNodeData.group.findIndex((q) => q === col));

    newNodeData.output = CollectionHandler.group(
      incomerData?.output as any[],
      newNodeData.group,
      incomerData!.sort
    );

    dispatch(setNodeData(newNodeData));
  };

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
          <>
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
            <button
              onClick={() =>
                dispatch(
                  openModal({
                    title: "Data Preview",
                    data: nodeData!,
                  })
                )
              }
              type="button"
              className="text-white border border-sky-500 bg-sky-600 hover:bg-sky-500 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-full text-sm p-2 text-center mr-2 mb-2"
            >
              <EyeIcon className="w-3 h-3" />
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
                <PlusIcon strokeWidth={3} className="w-3 h-3" />
              </button>
            )}
            <button
              onClick={() => setDropdownIsComponentVisible(true)}
              type="button"
              className="text-white border border-teal-600 bg-teal-700 hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-400 font-medium rounded-full text-sm p-2 text-center mr-2 mb-2"
            >
              <PlusIcon strokeWidth={3} className="w-3 h-3" />
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
                        !nodeData?.group?.some(
                          (group) => col?.originalName === group
                        )
                    ) || []
                  ).map((col, index) => (
                    <li
                      onClick={() => addGroup(col.originalName)}
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
          <p className="text-white">Group Node</p>
        </div>
        {!!nodeData?.group.length && (
          <ul className="bg-sky-800 hover:bg-sky-700 rounded-lg p-2 space-y-2">
            {nodeData?.group.map((groupItem, index) => (
              <li
                key={`group-${groupItem}-${index}-${id}`}
                className="text-base text-gray-50"
              >
                <div className="flex w-full items-center justify-between">
                  {groupItem}
                  <div className="space-x-2">
                    <button
                      onClick={() => deleteSort(groupItem)}
                      type="button"
                      className="text-white border border-red-500 bg-red-600 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-1 text-center"
                    >
                      <XMarkIcon strokeWidth={3} className="w-3 h-3" />
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

export default memo(GroupNode);
