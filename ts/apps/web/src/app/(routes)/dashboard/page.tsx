"use client";

import { api } from "~web/utils/api";
import { useSession } from "next-auth/react";
import { DashboardInnerPage } from "@noot/ui/src/pages/Dashboard/DashboardInnerPage";

const Dashboard = () => {
  const user = useSession();

  const userBoxes = api.box.getUserBoxes.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const boxesToRender = userBoxes.data
    ? userBoxes.data.map((box) => ({
        id: box.id,
        name: box.name,
        description: "Box description",
        added: box.createdAt,
        updated: box.updatedAt,
      }))
    : [];

  return (
    <div className={"h-full"}>
      <DashboardInnerPage userBoxes={boxesToRender} />
    </div>
  );
};

export default Dashboard;
