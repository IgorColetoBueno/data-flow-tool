"use client";
import Loading from "@/app/loading";
import { isJSONDate } from "@/regex";
import { BoardDbHandler, IBoard } from "@/storage/boardDbHandler";
import { IDataStateNode, IDataStateNodeColumn } from "@/store/dataSlice";
import { CollectionHandler } from "@/util/collectionHandler";
import {
  IOutputWorkerData,
  IOutputWorkerMessage,
} from "@/workers/output.worker";
import { PrinterIcon } from "@heroicons/react/24/outline";
import { isDate } from "date-fns";
import ReactECharts from "echarts-for-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./chartTheme";
import { ECHARTS_COLORS, getRandomColorByIndex } from "./chartTheme";

interface ILineChartProps {
  params: {
    id: string;
    outputId: string;
  };
}

const LineChart = ({ params: { id, outputId } }: ILineChartProps) => {
  const [dataItems, setDataItems] = useState<any[] | Object>();
  const [board, setBoard] = useState<IBoard>();
  const workerRef = useRef<Worker>();
  const isArray = Array.isArray(dataItems);

  const dataStateNode = useMemo(
    () =>
      board?.board?.data.nodes.find((q) => q.id === outputId) as IDataStateNode,
    [board?.board?.data.nodes, outputId]
  );

  const getNewColumnName = useCallback(
    (originalName: string) => {
      return dataStateNode.columns.find((q) => q.originalName === originalName)
        ?.newName;
    },
    [dataStateNode?.columns]
  );

  const getOption = useCallback(
    (currDataItems: any[], key?: string, index?: number) => {
      const series = [
        {
          name: getNewColumnName(dataStateNode.yAxisColumn!),
          data: currDataItems.map(
            (q) =>
              Object.getOwnPropertyDescriptor(q, dataStateNode.yAxisColumn!)
                ?.value
          ),
          type: "line",
          color: getRandomColorByIndex(index!),
        },
      ];

      debugger;

      return {
        title: !!key
          ? {
              text: key,
              left: "center",
              top: 0,
            }
          : undefined,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          formatter: (value: any) => {
            const yValue = isJSONDate(value[0].axisValue)
              ? getFormattedValue(new Date(value[0].axisValue))
              : getFormattedValue(value[0].axisValue);

            const xValue = isJSONDate(value[0].data)
              ? getFormattedValue(new Date(value[0].data))
              : getFormattedValue(value[0].data);

            return `${getNewColumnName(
              dataStateNode.xAxisColumn!
            )}: <strong>${yValue}</strong><br>${getNewColumnName(
              dataStateNode.yAxisColumn!
            )}: <strong>${xValue}</strong>`;
          },
        },
        xAxis: {
          scale: true,
          name: getNewColumnName(dataStateNode.xAxisColumn!),
          nameLocation: "middle",
          nameTextStyle: {
            align: "middle",
            verticalAlign: "top",
            padding: [40, 0, 0, 0],
            fontWeight: "bold",
          },
          nameGap: 0,
          category: "time",
          data: currDataItems.map(
            (q) =>
              Object.getOwnPropertyDescriptor(q, dataStateNode.xAxisColumn!)
                ?.value
          ),
          axisLabel: {
            formatter: function (val: string) {
              if (isJSONDate(val)) {
                return getFormattedValue(new Date(val));
              }
              return getFormattedValue(val);
            },
          },
        },
        yAxis: {
          type: "value",
          scale: true,
          name: getNewColumnName(dataStateNode.yAxisColumn!),
          nameLocation: "middle",
          nameTextStyle: {
            align: "middle",
            verticalAlign: "bottom",
            fontWeight: "bold",
          },
          nameGap: 30,
        },
        dataZoom: [
          {
            type: "slider",
            xAxisIndex: 0,
            filterMode: "none",
          },
          {
            type: "slider",
            yAxisIndex: 0,
            filterMode: "none",
          },
          {
            type: "inside",
            xAxisIndex: 0,
            filterMode: "none",
          },
          {
            type: "inside",
            yAxisIndex: 0,
            filterMode: "none",
          },
        ],
        series,
      };
    },
    [dataStateNode?.xAxisColumn, dataStateNode?.yAxisColumn, getNewColumnName]
  );

  const options = useMemo(() => {
    if (!dataStateNode || !dataItems) return null;

    return isArray
      ? ([getOption(dataItems as any[])] as any[])
      : (Object.keys(dataItems).map((key, index) =>
          getOption((dataItems as any)[key] as any[], key, index)
        ) as any[]);
  }, [dataItems, dataStateNode, getOption, isArray]);

  const init = useCallback(async () => {
    workerRef.current?.postMessage({
      dataStateNode,
      id,
    } as IOutputWorkerData);
  }, [dataStateNode, id]);

  const getFormattedValue = (value: any) => {
    if (typeof value === "object") {
      if (isDate(value)) {
        return (value as Date).toLocaleDateString();
      }
      return JSON.stringify(value);
    }
    return value;
  };

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
    if (!board) return;

    init();
  }, [board, init]);

  useEffect(() => {
    BoardDbHandler.getOne(id).then(setBoard);
  }, [id]);

  if (!dataItems || !options) {
    return <Loading />;
  }

  return (
    <div className="w-full h-full bg-[#5b5c6e] relative">
      {options.map((option, index) => (
        <div
          key={`option-${index}`}
          style={{ paddingLeft: "50px", paddingRight: "50px" }}
          className="w-full overflow-x-auto bg-[#5b5c6e]"
        >
          <ReactECharts
            theme="purple-passion"
            style={{ height: "80vh" }}
            option={option}
          />
        </div>
      ))}
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

export default LineChart;
