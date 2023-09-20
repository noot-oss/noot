import { PageWrapper } from "~ui/components/PageWrapper";
import { DashboardMetricsInnerPage } from "../../../pages/Dashboard/Metrics/DashboardMetricsInnerPage";
import {
  alternateLineGraphChartData,
  mockBoxData,
  mockCurrentData,
  mockLineGraphChartData,
  mockTrackerData,
} from "./data";

export const DashboardMetricsStory = () => (
  <PageWrapper>
    <DashboardMetricsInnerPage
      uptimeTrackerData={mockTrackerData}
      currentData={mockCurrentData}
      boxData={mockBoxData}
      userBoxesCount={2}
      lineGraphData={{
        ...mockLineGraphChartData,
        data: alternateLineGraphChartData,
      }}
    />
  </PageWrapper>
);
