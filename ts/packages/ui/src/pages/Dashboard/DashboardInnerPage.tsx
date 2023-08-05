import { H1, H2 } from "~ui/components/Typography";
import type { Box } from "~ui/lib/Box";
import { DashboardMultiBox } from "./DashboardMultiBox";

export const DashboardInnerPage = (props: { userBoxes: Box[] }) => {
  if (props.userBoxes.length === 0) {
    return (
      <>
        <H1>Dashboard</H1>
        <H2>You don't have any boxes yet.</H2>
      </>
    );
  }

  if (props.userBoxes.length > 1) {
    return (
      <>
        <DashboardMultiBox userBoxes={props.userBoxes} />
      </>
    );
  }

  return (
    <>
      <H1>Dashboard with metrics</H1>
    </>
  );
};
