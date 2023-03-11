"use client";
import Loading from "@/app/loading";
import { BoardDbHandler, IBoard } from "@/storage/boardDbHandler";
import { IDataStateNode, IDataStateNodeColumn } from "@/store/dataSlice";
import {
  IOutputWorkerData,
  IOutputWorkerMessage,
} from "@/workers/output.worker";
import { PrinterIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { isDate } from "date-fns";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getIncomers } from "reactflow";

interface IReportProps {
  params: {
    id: string;
    outputId: string;
  };
}

const Report = ({ params: { id, outputId } }: IReportProps) => {
  const [dataItems, setDataItems] = useState<any[] | Object>();
  const [board, setBoard] = useState<IBoard>();
  const workerRef = useRef<Worker>();
  const isArray = Array.isArray(dataItems);

  const incomer = useMemo(() => {
    if (!board?.board?.editor) return null;

    return (getIncomers(
      (board?.board?.editor.nodes || []).find((q) => q.id === outputId)!,
      board?.board?.editor?.nodes!,
      board?.board?.editor?.edges!
    ) || [])[0];
  }, [board, outputId]);

  const dataStateNode = useMemo(
    () =>
      board?.board?.data.nodes.find(
        (q) => q.id === incomer?.id
      ) as IDataStateNode,
    [board?.board?.data.nodes, incomer?.id]
  );

  const init = useCallback(async () => {
    workerRef.current?.postMessage({
      dataStateNode,
      id,
    } as IOutputWorkerData);
  }, [dataStateNode, id]);

  const getValue = (item: any, key: IDataStateNodeColumn) => {
    if (typeof item[key.originalName] === "object") {
      if (isDate(item[key.originalName])) {
        return (item[key.originalName] as Date).toLocaleDateString();
      }
      return JSON.stringify(item[key.originalName]);
    }
    return item[key.originalName];
  };

  const renderTable = useCallback(() => {
    if (!(dataItems as any[]).length) return <p>No data to display</p>;

    const keys = dataStateNode.columns.filter((q) => q.checked);

    return (
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-50">
        <thead className="text-xs text-gray-700 uppercase dark:text-gray-50">
          <tr>
            {keys.map((key, index) => (
              <th
                scope="col"
                className="px-6 py-3 bg-gray-50 dark:bg-gray-800"
                key={key.originalName + index}
              >
                {key.newName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(dataItems as any[]).map((item, index) => (
            <tr
              className="border-b border-gray-200 dark:border-gray-700"
              key={`item-${index}`}
            >
              {keys.map((key, keyIndex) => (
                <td
                  scope="row"
                  className={classNames(
                    index % 2 === 1
                      ? "px-6 py-4 text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                      : "px-6 py-4"
                  )}
                  key={key.originalName + index + keyIndex}
                >
                  {getValue(item, key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }, [dataItems, dataStateNode?.columns]);

  const renderGroupedTable = useCallback(() => {
    const groupedKeys = Object.keys(dataItems || {});

    if (!groupedKeys.length) return <p>No data to display</p>;

    const keys = (dataStateNode?.columns || []).filter((q) => q.checked);

    return (
      <div className="space-y-2">
        {groupedKeys.map((groupedKey, index) => (
          <div key={`grouped-item-${index}`}>
            <p className="text-base text-gray-50 p-2 text-lg font-semibold bg-gray-50 dark:bg-gray-800">
              {groupedKey}
            </p>

            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-50">
              <thead className="text-xs text-gray-700 uppercase dark:text-gray-50">
                <tr>
                  {keys.map((key, index) => (
                    <th
                      scope="col"
                      className="px-6 py-3 bg-gray-50 dark:bg-gray-800"
                      key={key.originalName + index}
                    >
                      {key.newName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(
                  (Object.getOwnPropertyDescriptor(dataItems, groupedKey)
                    ?.value as any[]) || []
                ).map((item, index) => (
                  <tr
                    className="border-b border-gray-200 dark:border-gray-700"
                    key={`item-${index}`}
                  >
                    {keys.map((key, keyIndex) => (
                      <td
                        scope="row"
                        className={classNames(
                          index % 2 === 1
                            ? "px-6 py-4 text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                            : "px-6 py-4"
                        )}
                        key={key.originalName + index + keyIndex}
                      >
                        {getValue(item, key)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    );
  }, [dataItems, dataStateNode?.columns]);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../../../../../workers/output.worker.ts", import.meta.url)
    );

    workerRef.current.onmessage = (
      event: MessageEvent<IOutputWorkerMessage>
    ) => {
      if (event.data.type === "error") {
        alert("Error");
        return;
      }

      setDataItems(event.data.payload);
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  useEffect(() => {
    if (!board || !incomer) return;

    init();
  }, [board, incomer, init]);

  useEffect(() => {
    BoardDbHandler.getOne(id).then(setBoard);
  }, [id]);

  if (!dataItems) {
    return <Loading />;
  }

  return (
    <div className="w-full h-full bg-white relative">
      <div className="overflow-x-auto bg-gray-700">
        {!isArray && renderGroupedTable()}
        {isArray && renderTable()}
      </div>
      <button
        onClick={() => window.print()}
        type="button"
        className="print:hidden fixed bottom-5 right-5 text-white border border-green-500 bg-green-600 hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-full text-sm p-5 text-center"
      >
        <PrinterIcon strokeWidth={3} className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Report;
