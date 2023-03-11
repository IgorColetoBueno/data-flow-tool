import useComponentVisible from "@/hooks/useComponentIsVisible";
import { RootState } from "@/store";
import { deleteNodeData, IDataStateNode, setNodeData } from "@/store/dataSlice";
import { deleteNode, toggleSelected } from "@/store/editorSlice";
import { openModal } from "@/store/modalPreviewSlice";
import { CollectionHandler } from "@/util/collectionHandler";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import {
  ArrowUturnLeftIcon,
  EyeIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { memo, useCallback, useLayoutEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getIncomers,
  getOutgoers,
  Handle,
  NodeProps,
  Position,
} from "reactflow";

const SortNode = ({ selected, isConnectable, id }: NodeProps) => {
  const dispatch = useDispatch();
  const {
    isComponentVisible: isDropdownComponentVisible,
    ref: dropdownRef,
    setIsComponentVisible: setDropdownIsComponentVisible,
  } = useComponentVisible(false);
  const data = useSelector((state: RootState) => state.data);
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

  const updateOutgoers = useCallback(
    (newNodeData: IDataStateNode) => {
      const currentNode = editor.nodes.find((q) => q.id === newNodeData.id);

      const outgoers = getOutgoers(currentNode!, editor.nodes, editor.edges);

      if (outgoers && !!outgoers.length) {
        outgoers.forEach((outgoer) => {
          const outgoerNodeData = data.nodes.find((q) => q.id === outgoer.id);
          dispatch(
            setNodeData({ ...outgoerNodeData!, sort: newNodeData.sort })
          );

          updateOutgoers({ ...newNodeData, id: outgoer.id });
        });
      }
    },
    [data.nodes, dispatch, editor.edges, editor.nodes]
  );

  const resetData = useCallback(() => {
    if (!incomerData) return;
    const newNodeData = {
      ...incomerData,
      id,
    };
    dispatch(setNodeData(newNodeData));
    updateOutgoers(newNodeData);
  }, [dispatch, id, incomerData, updateOutgoers]);

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
    updateOutgoers(newNodeData);
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
    updateOutgoers(newNodeData);
  };

  const deleteSort = (col: string) => {
    const newNodeData = structuredClone(nodeData) as IDataStateNode;

    newNodeData.sort.splice(newNodeData.sort.findIndex((q) => q.name === col));

    dispatch(setNodeData(newNodeData));
    updateOutgoers(newNodeData);
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
                    nodeData?.columns.filter(
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
          <ul className="bg-sky-800 hover:bg-sky-700 rounded-lg p-2 space-y-2">
            {nodeData?.sort.map((sortItem, index) => (
              <li
                key={`sort-${sortItem}-${index}-${id}`}
                className="text-base text-gray-50"
              >
                <div className="flex w-full items-center justify-between">
                  {
                    nodeData?.columns.find(
                      (q) => q.originalName === sortItem.name
                    )?.newName
                  }
                  <div className="space-x-2">
                    {sortItem.desc && (
                      <button
                        onClick={() => handleItemNameCheck(false, index)}
                        type="button"
                        className="text-white border border-sky-600 bg-sky-700 hover:bg-sky-600 focus:ring-4 focus:outline-none focus:ring-sky-400 font-medium rounded-full text-sm p-1 text-center"
                      >
                        <ChevronUpIcon className="w-3 h-3" />
                      </button>
                    )}
                    {!sortItem.desc && (
                      <button
                        onClick={() => handleItemNameCheck(true, index)}
                        type="button"
                        className="text-white border border-sky-600 bg-sky-700 hover:bg-sky-600 focus:ring-4 focus:outline-none focus:ring-sky-400 font-medium rounded-full text-sm p-1 text-center"
                      >
                        <ChevronDownIcon className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        deleteSort(sortItem.name);
                      }}
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

export default memo(SortNode);
