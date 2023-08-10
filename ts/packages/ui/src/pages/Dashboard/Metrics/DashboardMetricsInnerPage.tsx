import {
  Card,
  Text,
  Metric,
  Grid,
  Flex,
  BadgeDelta,
  Title,
  LineChart,
  Col,
  Tracker,
} from "@tremor/react";
import { H1 } from "~ui/components/Typography";
import Link from "next/link";
import { ArrowLongLeftIcon } from "@heroicons/react/24/solid";

interface UptimeTrackerData {
  color: "emerald" | "rose" | "gray";
  tooltip: "Operational" | "Down";
}

interface CurrentDataEntry {
  value: number;
  delta: "increase" | "decrease";
}

interface CurrentData {
  co2: CurrentDataEntry;
  temperature: CurrentDataEntry;
  humidity: CurrentDataEntry;
}

interface BoxData {
  name: string;
}

export interface MetricsProps {
  uptimeTrackerData: UptimeTrackerData[];
  currentData: CurrentData;
  boxData: BoxData;
}

const NumberMetricCard = (props: {
  title: string;
  value: number;
  unit: string;
  delta: "increase" | "decrease";
}) => (
  <Card>
    <Flex justifyContent="between" alignItems="center">
      <Text>{props.title}</Text>
      <BadgeDelta deltaType={props.delta} isIncreasePositive={true} size="xs">
        +12.3%
      </BadgeDelta>
    </Flex>
    <Metric>
      {props.value}
      {props.unit}
    </Metric>
  </Card>
);

const LineGraphAllData = () => (
  <Card className={"h-full"}>
    <Title>All metrics over time</Title>
    <LineChart
      className="mt-6"
      data={[]}
      index="year"
      categories={["Export Growth Rate", "Import Growth Rate"]}
      colors={["emerald", "gray"]}
      yAxisWidth={40}
    />
  </Card>
);

const UptimeTracker = (props: { data: UptimeTrackerData[] }) => (
  <Card>
    <Title>Status</Title>
    <Tracker data={props.data} className="mt-2" />
  </Card>
);

const AlertsCard = () => (
  <Card className={"h-full"}>
    <Title>Alerts</Title>
    <Text>There are no alerts</Text>
  </Card>
);

export const DashboardMetricsInnerPage = (props: MetricsProps) => {
  return (
    <div className="flex h-full flex-col">
      <Link
        href={"/dashboard"}
        className="mb-4 flex w-fit flex-row items-center text-white text-opacity-50 transition-colors hover:text-opacity-100"
      >
        <ArrowLongLeftIcon className="mr-2 h-6 w-6" />
        <span>Back to dashboard</span>
      </Link>
      <H1 className="mb-8">{props.boxData.name}</H1>

      <Grid numItemsSm={1} numItemsLg={4} className={"h-fit gap-8"}>
        <NumberMetricCard
          title={"Co2 levels"}
          value={props.currentData.co2.value}
          unit={"ppm"}
          delta={props.currentData.co2.delta}
        />

        <NumberMetricCard
          title={"Temperature"}
          value={props.currentData.temperature.value}
          unit={"°C"}
          delta={props.currentData.temperature.delta}
        />

        <NumberMetricCard
          title={"Humidity"}
          value={props.currentData.humidity.value}
          unit={"%"}
          delta={props.currentData.humidity.delta}
        />

        <UptimeTracker data={props.uptimeTrackerData} />

        <Col numColSpan={1} numColSpanLg={3}>
          <LineGraphAllData />
        </Col>

        <Col numColSpan={1}>
          <AlertsCard />
        </Col>
      </Grid>
    </div>
  );
};
