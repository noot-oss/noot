import { MetricsProps } from "../../../pages/Dashboard/Metrics/DashboardMetricsInnerPage";

export const mockTrackerData: MetricsProps["uptimeTrackerData"] = [
  {
    tooltip: "Operational",
    color: "emerald",
  },
  {
    tooltip: "Down",
    color: "rose",
  },
  {
    tooltip: "Operational",
    color: "emerald",
  },
  {
    tooltip: "Operational",
    color: "emerald",
  },
  {
    tooltip: "Operational",
    color: "emerald",
  },
  {
    tooltip: "Operational",
    color: "emerald",
  },
  {
    tooltip: "Operational",
    color: "emerald",
  },
  {
    tooltip: "Operational",
    color: "emerald",
  },
  {
    tooltip: "Operational",
    color: "emerald",
  },
  {
    tooltip: "Operational",
    color: "emerald",
  },
  {
    tooltip: "Down",
    color: "rose",
  },
  {
    tooltip: "Operational",
    color: "emerald",
  },
  {
    tooltip: "Operational",
    color: "emerald",
  },
  {
    tooltip: "Operational",
    color: "emerald",
  },
  {
    tooltip: "Operational",
    color: "emerald",
  },
  {
    tooltip: "Operational",
    color: "emerald",
  },
  {
    tooltip: "Operational",
    color: "emerald",
  },
  {
    tooltip: "Operational",
    color: "emerald",
  },
  {
    tooltip: "Operational",
    color: "emerald",
  },
  {
    tooltip: "Operational",
    color: "emerald",
  },
  {
    tooltip: "Operational",
    color: "emerald",
  },
  {
    tooltip: "Operational",
    color: "emerald",
  },
  {
    tooltip: "Operational",
    color: "emerald",
  },
  {
    tooltip: "Operational",
    color: "emerald",
  },
  {
    tooltip: "Operational",
    color: "emerald",
  },
];

export const mockCurrentData: MetricsProps["currentData"] = {
  co2: {
    delta: "increase",
    value: 500,
  },
  humidity: {
    delta: "decrease",
    value: 75,
  },
  temperature: {
    delta: "increase",
    value: 25,
  },
};

export const mockBoxData: MetricsProps["boxData"] = {
  name: "Bedroom Box",
};

export const mockLineGraphChartData: MetricsProps["lineGraphData"] = {
  data: [
    {
      day: 0,
      temperature: 20,
    },
    {
      day: 1,
      temperature: 21,
    },
    {
      day: 2,
      temperature: 21,
    },
    {
      day: 3,
      temperature: 18,
    },
    {
      day: 4,
      temperature: 20,
    },
    {
      day: 5,
      temperature: 21,
    },
    {
      day: 6,
      temperature: 21,
    },
    {
      day: 7,
      temperature: 18,
    },
    {
      day: 8,
      temperature: 20,
    },
    {
      day: 9,
      temperature: 21,
    },
    {
      day: 10,
      temperature: 21,
    },
  ],
  index: "day",
  categories: ["temperature"],
};

export const alternateLineGraphChartData: MetricsProps["lineGraphData"]["data"] =
  Array.from({ length: 31 }, (_, i) => ({
    day: i,
    temperature: Math.floor(Math.random() * 10) + 20,
  }));
