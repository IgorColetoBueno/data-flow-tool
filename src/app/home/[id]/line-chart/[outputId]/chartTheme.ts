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

echarts.registerTheme("dark", {
  color: [
    "#dd6b66",
    "#759aa0",
    "#e69d87",
    "#8dc1a9",
    "#ea7e53",
    "#eedd78",
    "#73a373",
    "#73b9bc",
    "#7289ab",
    "#91ca8c",
    "#f49f42",
  ],
  backgroundColor: "rgba(51,51,51,1)",
  textStyle: {},
  title: {
    textStyle: {
      color: "#eeeeee",
    },
    subtextStyle: {
      color: "#aaaaaa",
    },
  },
  line: {
    itemStyle: {
      borderWidth: 1,
    },
    lineStyle: {
      width: 2,
    },
    symbolSize: 4,
    symbol: "circle",
    smooth: false,
  },
  radar: {
    itemStyle: {
      borderWidth: 1,
    },
    lineStyle: {
      width: 2,
    },
    symbolSize: 4,
    symbol: "circle",
    smooth: false,
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
      color: "#fd1050",
      color0: "#0cf49b",
      borderColor: "#fd1050",
      borderColor0: "#0cf49b",
      borderWidth: 1,
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
    symbolSize: 4,
    symbol: "circle",
    smooth: false,
    color: [
      "#dd6b66",
      "#759aa0",
      "#e69d87",
      "#8dc1a9",
      "#ea7e53",
      "#eedd78",
      "#73a373",
      "#73b9bc",
      "#7289ab",
      "#91ca8c",
      "#f49f42",
    ],
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
        areaColor: "rgba(255,215,0,0.8)",
        borderColor: "#444",
        borderWidth: 1,
      },
      label: {
        color: "rgb(100,0,0)",
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
        areaColor: "rgba(255,215,0,0.8)",
        borderColor: "#444",
        borderWidth: 1,
      },
      label: {
        color: "rgb(100,0,0)",
      },
    },
  },
  categoryAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: "#eeeeee",
      },
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: "#eeeeee",
      },
    },
    axisLabel: {
      show: true,
      color: "#eeeeee",
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ["#aaaaaa"],
      },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ["#eeeeee"],
      },
    },
  },
  valueAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: "#eeeeee",
      },
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: "#eeeeee",
      },
    },
    axisLabel: {
      show: true,
      color: "#eeeeee",
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ["#aaaaaa"],
      },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ["#eeeeee"],
      },
    },
  },
  logAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: "#eeeeee",
      },
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: "#eeeeee",
      },
    },
    axisLabel: {
      show: true,
      color: "#eeeeee",
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ["#aaaaaa"],
      },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ["#eeeeee"],
      },
    },
  },
  timeAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: "#eeeeee",
      },
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: "#eeeeee",
      },
    },
    axisLabel: {
      show: true,
      color: "#eeeeee",
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ["#aaaaaa"],
      },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ["#eeeeee"],
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
      color: "#eeeeee",
    },
  },
  tooltip: {
    axisPointer: {
      lineStyle: {
        color: "#eeeeee",
        width: "1",
      },
      crossStyle: {
        color: "#eeeeee",
        width: "1",
      },
    },
  },
  timeline: {
    lineStyle: {
      color: "#eeeeee",
      width: 1,
    },
    itemStyle: {
      color: "#dd6b66",
      borderWidth: 1,
    },
    controlStyle: {
      color: "#eeeeee",
      borderColor: "#eeeeee",
      borderWidth: 0.5,
    },
    checkpointStyle: {
      color: "#e43c59",
      borderColor: "#c23531",
    },
    label: {
      color: "#eeeeee",
    },
    emphasis: {
      itemStyle: {
        color: "#a9334c",
      },
      controlStyle: {
        color: "#eeeeee",
        borderColor: "#eeeeee",
        borderWidth: 0.5,
      },
      label: {
        color: "#eeeeee",
      },
    },
  },
  visualMap: {
    color: ["#bf444c", "#d88273", "#f6efa6"],
  },
  dataZoom: {
    backgroundColor: "rgba(47,69,84,0)",
    dataBackgroundColor: "rgba(255,255,255,0.3)",
    fillerColor: "rgba(167,183,204,0.4)",
    handleColor: "#a7b7cc",
    handleSize: "100%",
    textStyle: {
      color: "#eeeeee",
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
