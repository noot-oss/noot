import { PageWrapper } from "~ui/components/PageWrapper";
import { DashboardMetricsInnerPage } from "../../../pages/Dashboard/Metrics/DashboardMetricsInnerPage";
import { mockBoxData, mockCurrentData, mockTrackerData } from "./data";

export const DashboardMetricsStory = () => (
  <PageWrapper>
    <DashboardMetricsInnerPage
      uptimeTrackerData={mockTrackerData}
      currentData={mockCurrentData}
      boxData={mockBoxData}
    />
  </PageWrapper>
);
