"use client";

import { api } from "~/utils/api";
import { DashboardInner } from "~/components/DashboardInner";
import { useSession } from "next-auth/react";

const Dashboard = () => {
  const user = useSession();

  const userBoxes = api.box.getUserBoxes.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  return (
    <div className={"h-full"}>
      <DashboardInner
        userBoxes={userBoxes.data ?? []}
        userName={user.data?.user?.name ?? "Unknown user"}
      />
    </div>
  );
};

export default Dashboard;
