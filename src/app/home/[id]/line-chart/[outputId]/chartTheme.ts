import * as echarts from "echarts";
export const ECHARTS_COLORS = [
  "#9b8bba",
  "#e098c7",
  "#8fd3e8",
  "#71669e",
  "#cc70af",
  "#7cb4cc",
  "#595959",
  "#808f85",
  "#91c499",
  "#f2e9dc",
  "#cfd11a",
  "#ef798a",
  "#f7a9a8",
  "#613f75",
  "#e5c3d1",
  "#988b8e",
  "#bf1a2f",
  "#f00699",
  "#454e9e",
  "#018e42",
  "#f7d002",
  "#daf7dc",
  "#9ee493",
  "#abc8c0",
  "#70566d",
  "#42273b",
  "#fdfffc",
  "#235789",
  "#c1292e",
  "#f1d302",
  "#020100",
  "#000000",
  "#fffffc",
  "#beb7a4",
  "#ff7f11",
  "#ff1b1c",
  "#ccd5ae",
  "#e9edc9",
  "#fefae0",
  "#faedcd",
  "#d4a373",
  "#606c38",
  "#283618",
  "#fefae0",
  "#dda15e",
  "#bc6c25",
  "#e63946",
  "#f1faee",
  "#a8dadc",
  "#457b9d",
  "#1d3557",
  "#cdb4db",
  "#ffc8dd",
  "#ffafcc",
  "#bde0fe",
  "#a2d2ff",
  "#8ecae6",
  "#219ebc",
  "#023047",
  "#ffb703",
  "#fb8500",
  "#264653",
  "#2a9d8f",
  "#e9c46a",
  "#f4a261",
  "#e76f51",
  "#003049",
  "#d62828",
  "#f77f00",
  "#fcbf49",
  "#eae2b7",
];

export const getRandomColorByIndex = (index?: number): string => {
  if (index === -1 || index === undefined) {
    return ECHARTS_COLORS[0];
  }

  if (index < ECHARTS_COLORS.length) {
    return ECHARTS_COLORS[index];
  }

  return getRandomColorByIndex(index - ECHARTS_COLORS.length);
};

echarts.registerTheme("purple-passion", {
  color: ECHARTS_COLORS,
  backgroundColor: "rgba(91,92,110,1)",
  textStyle: {},
  title: {
    textStyle: {
      color: "#ffffff",
    },
    subtextStyle: {
      color: "#cccccc",
    },
  },
  line: {
    itemStyle: {
      borderWidth: "2",
    },
    lineStyle: {
      width: "3",
    },
    symbolSize: "7",
    symbol: "circle",
    smooth: true,
  },
  radar: {
    itemStyle: {
      borderWidth: "2",
    },
    lineStyle: {
      width: "3",
    },
    symbolSize: "7",
    symbol: "circle",
    smooth: true,
  },
  bar: {
    itemStyle: {
      barBorderWidth: 0,
      barBorderColor: "#ccc",
    },
  },
  pie: {
    itemStyle: {
      borderWidth: 0,
      borderColor: "#ccc",
    },
  },
  scatter: {
    itemStyle: {
      borderWidth: 0,
      borderColor: "#ccc",
    },
  },
  boxplot: {
    itemStyle: {
      borderWidth: 0,
      borderColor: "#ccc",
    },
  },
  parallel: {
    itemStyle: {
      borderWidth: 0,
      borderColor: "#ccc",
    },
  },
  sankey: {
    itemStyle: {
      borderWidth: 0,
      borderColor: "#ccc",
    },
  },
  funnel: {
    itemStyle: {
      borderWidth: 0,
      borderColor: "#ccc",
    },
  },
  gauge: {
    itemStyle: {
      borderWidth: 0,
      borderColor: "#ccc",
    },
  },
  candlestick: {
    itemStyle: {
      color: "#e098c7",
      color0: "transparent",
      borderColor: "#e098c7",
      borderColor0: "#8fd3e8",
      borderWidth: "2",
    },
  },
  graph: {
    itemStyle: {
      borderWidth: 0,
      borderColor: "#ccc",
    },
    lineStyle: {
      width: 1,
      color: "#aaaaaa",
    },
    symbolSize: "7",
    symbol: "circle",
    smooth: true,
    color: ["#9b8bba", "#e098c7", "#8fd3e8", "#71669e", "#cc70af", "#7cb4cc"],
    label: {
      color: "#eeeeee",
    },
  },
  map: {
    itemStyle: {
      areaColor: "#eee",
      borderColor: "#444",
      borderWidth: 0.5,
    },
    label: {
      color: "#000",
    },
    emphasis: {
      itemStyle: {
        areaColor: "#e098c7",
        borderColor: "#444",
        borderWidth: 1,
      },
      label: {
        color: "#ffffff",
      },
    },
  },
  geo: {
    itemStyle: {
      areaColor: "#eee",
      borderColor: "#444",
      borderWidth: 0.5,
    },
    label: {
      color: "#000",
    },
    emphasis: {
      itemStyle: {
        areaColor: "#e098c7",
        borderColor: "#444",
        borderWidth: 1,
      },
      label: {
        color: "#ffffff",
      },
    },
  },
  categoryAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: "#cccccc",
      },
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: "#333",
      },
    },
    axisLabel: {
      show: true,
      color: "#cccccc",
    },
    splitLine: {
      show: false,
      lineStyle: {
        color: ["#eeeeee", "#333333"],
      },
    },
    splitArea: {
      show: true,
      areaStyle: {
        color: ["rgba(250,250,250,0.05)", "rgba(200,200,200,0.02)"],
      },
    },
  },
  valueAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: "#cccccc",
      },
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: "#333",
      },
    },
    axisLabel: {
      show: true,
      color: "#cccccc",
    },
    splitLine: {
      show: false,
      lineStyle: {
        color: ["#eeeeee", "#333333"],
      },
    },
    splitArea: {
      show: true,
      areaStyle: {
        color: ["rgba(250,250,250,0.05)", "rgba(200,200,200,0.02)"],
      },
    },
  },
  logAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: "#cccccc",
      },
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: "#333",
      },
    },
    axisLabel: {
      show: true,
      color: "#cccccc",
    },
    splitLine: {
      show: false,
      lineStyle: {
        color: ["#eeeeee", "#333333"],
      },
    },
    splitArea: {
      show: true,
      areaStyle: {
        color: ["rgba(250,250,250,0.05)", "rgba(200,200,200,0.02)"],
      },
    },
  },
  timeAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: "#cccccc",
      },
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: "#333",
      },
    },
    axisLabel: {
      show: true,
      color: "#cccccc",
    },
    splitLine: {
      show: false,
      lineStyle: {
        color: ["#eeeeee", "#333333"],
      },
    },
    splitArea: {
      show: true,
      areaStyle: {
        color: ["rgba(250,250,250,0.05)", "rgba(200,200,200,0.02)"],
      },
    },
  },
  toolbox: {
    iconStyle: {
      borderColor: "#999999",
    },
    emphasis: {
      iconStyle: {
        borderColor: "#666666",
      },
    },
  },
  legend: {
    textStyle: {
      color: "#cccccc",
    },
  },
  tooltip: {
    axisPointer: {
      lineStyle: {
        color: "#cccccc",
        width: 1,
      },
      crossStyle: {
        color: "#cccccc",
        width: 1,
      },
    },
  },
  timeline: {
    lineStyle: {
      color: "#8fd3e8",
      width: 1,
    },
    itemStyle: {
      color: "#8fd3e8",
      borderWidth: 1,
    },
    controlStyle: {
      color: "#8fd3e8",
      borderColor: "#8fd3e8",
      borderWidth: 0.5,
    },
    checkpointStyle: {
      color: "#8fd3e8",
      borderColor: "#8a7ca8",
    },
    label: {
      color: "#8fd3e8",
    },
    emphasis: {
      itemStyle: {
        color: "#8fd3e8",
      },
      controlStyle: {
        color: "#8fd3e8",
        borderColor: "#8fd3e8",
        borderWidth: 0.5,
      },
      label: {
        color: "#8fd3e8",
      },
    },
  },
  visualMap: {
    color: ["#8a7ca8", "#e098c7", "#cceffa"],
  },
  dataZoom: {
    backgroundColor: "rgba(0,0,0,0)",
    dataBackgroundColor: "rgba(255,255,255,0.3)",
    fillerColor: "rgba(167,183,204,0.4)",
    handleColor: "#a7b7cc",
    handleSize: "100%",
    textStyle: {
      color: "#333",
    },
  },
  markPoint: {
    label: {
      color: "#eeeeee",
    },
    emphasis: {
      label: {
        color: "#eeeeee",
      },
    },
  },
});
