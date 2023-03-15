import SelectField from "@/components/input/SelectField";
import { RootState } from "@/store";
import { deleteNodeData, IDataStateNode, setNodeData } from "@/store/dataSlice";
import { deleteNode, toggleSelected } from "@/store/editorSlice";
import { EyeIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import {
  ChangeEvent,
  memo,
  useCallback,
  useLayoutEffect,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIncomers, Handle, NodeProps, Position } from "reactflow";

const LineChartNode = ({ selected, isConnectable, id }: NodeProps) => {
  const dispatch = useDispatch();
  const editor = useSelector((state: RootState) => state.editor);
  const data = useSelector((state: RootState) => state.data);
  const node = editor.nodes.find((q) => q.id === id);
  const nodeData = useMemo(
    () => data.nodes.find((q) => q.id === id),
    [data.nodes, id]
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
    const listOfColumns: string[] = Object.keys(
      (incomerData?.output as any[])[0]
    );

    const newNodeData: IDataStateNode = {
      ...(incomerData as IDataStateNode),
      id,
      columns: listOfColumns.map((col) => ({
        checked: true,
        originalName: col,
        newName: col,
      })),
    };

    dispatch(setNodeData(newNodeData));
  }, [dispatch, id, incomerData]);

  useLayoutEffect(() => {
    if (!incomerData || !(incomerData.output as any[]).length || !!nodeData) {
      return;
    }

    resetData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id, incomerData, resetData]);

  const handleXAxisChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newNodeData = structuredClone(nodeData) as IDataStateNode;

    newNodeData.xAxisColumn = e.target.value;

    dispatch(setNodeData(newNodeData));
  };

  const handleYAxisChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newNodeData = structuredClone(nodeData) as IDataStateNode;

    newNodeData.yAxisColumn = e.target.value;

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
              href={`/home/${editor.boardId}/line-chart/${id}`}
              type="button"
              className="text-white border border-sky-500 bg-sky-600 hover:bg-sky-500 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-full text-sm p-2 text-center mr-2 mb-2"
            >
              <EyeIcon className="w-3 h-3" />
            </Link>
          </div>
        )}
      </div>

      <div className="block rounded-lg p-2 w-64 space-y-1">
        <span className="text-white text-center">Line chart Node</span>

        {!!nodeData?.output && (
          <ul className="bg-sky-800 hover:bg-sky-700 rounded-lg p-2 space-y-1">
            <div className="pl-3 pr-10 py-1 text-gray-50">
              <SelectField
                label="X axis"
                color="sky"
                variant={800}
                id={`x-axis-input`}
                onChange={handleXAxisChange}
                value={nodeData.xAxisColumn}
              >
                {nodeData.columns
                  .filter((q) => q.checked)
                  .map((item) => (
                    <option
                      key={`x-axis-${item.originalName}`}
                      value={item.originalName}
                    >
                      {item.newName}
                    </option>
                  ))}
              </SelectField>
              <SelectField
                label="Y axis"
                color="sky"
                variant={800}
                id={`y-axis-input`}
                onChange={handleYAxisChange}
                value={nodeData.yAxisColumn}
              >
                {nodeData.columns
                  .filter((q) => q.checked)
                  .map((item) => (
                    <option
                      key={`y-axis-${item.originalName}`}
                      value={item.originalName}
                    >
                      {item.newName}
                    </option>
                  ))}
              </SelectField>
            </div>

            {/* {nodeData.columns.map((item, index) => (
              <li
                className="text-base text-gray-50"
                key={`select-${item.originalName}-${index}-${id}`}
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center mr-3">

                    {itemToEdit !== index && (
                      <label
                        htmlFor={`${item}-${index}`}
                        className="ml-2 text-sm font-medium text-gray-50"
                      >
                        {item.newName}
                      </label>
                    )}
                  </div>
                  {itemToEdit === index && (
                    <button
                      onClick={() => setItemToEdit(-1)}
                      type="button"
                      className="text-white border border-teal-600 bg-teal-700 hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-400 font-medium rounded-full text-sm p-2 text-center mr-2 mb-2"
                    >
                      <CheckIcon className="w-3 h-3" />
                    </button>
                  )}
                  {itemToEdit !== index && (
                    <button
                      onClick={() => setItemToEdit(index)}
                      type="button"
                      className="text-white border border-blue-500 bg-blue-600 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2 text-center mr-2 mb-2"
                    >
                      <PencilIcon className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </li>
            ))} */}
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

export default memo(LineChartNode);
