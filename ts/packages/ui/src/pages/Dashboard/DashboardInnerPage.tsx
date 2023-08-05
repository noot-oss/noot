import { PageWrapper } from "@components/PageWrapper.tsx";
import { H1, H2 } from "@components/Typography.tsx";
import type { Box } from "~lib/Box.ts";
import { DashboardMultiBox } from "./DashboardMultiBox.tsx";

export const DashboardInnerPage = (props: { userBoxes: Box[] }) => {
  if (props.userBoxes.length === 0) {
    return (
      <PageWrapper>
        <H1>Dashboard</H1>
        <H2>You don't have any boxes yet.</H2>
      </PageWrapper>
    );
  }

  if (props.userBoxes.length > 1) {
    return (
      <PageWrapper>
        <DashboardMultiBox userBoxes={props.userBoxes} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <H1>Dashboard with metrics</H1>
    </PageWrapper>
  );
};
