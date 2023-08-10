"use client";

import { api } from "~web/utils/api";
import { useSession } from "next-auth/react";
import { DashboardInnerPage } from "@noot/ui/src/pages/Dashboard/DashboardInnerPage";
import { useState } from "react";

const Dashboard = () => {
  const user = useSession();
  const [hasRefetched, setHasRefetched] = useState(false);

  const {
    refetch: refetchUserBoxes,
    data: userBoxesData,
    isFetching: isFetchingUserBoxes,
    isError: isErrorUserBoxes,
  } = api.box.getUserBoxes.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const userCode = api.box.fetchCode.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const boxesToRender = userBoxesData
    ? userBoxesData.map((box) => ({
        id: box.id,
        name: box.name,
        description: "Box description",
        added: box.createdAt,
        updated: box.updatedAt,
      }))
    : [];

  const refetchData = () => {
    setHasRefetched(true);
    refetchUserBoxes();
  };

  const errorToDisplay = hasRefetched
    ? isErrorUserBoxes
      ? "too-many-requests"
      : "not-found"
    : undefined;

  return (
    <div className={"h-full"}>
      <DashboardInnerPage
        userBoxes={boxesToRender}
        code={userCode.data ? userCode.data.verificationCode : undefined}
        refetch={refetchData}
        isFetching={isFetchingUserBoxes}
        fetchedMessage={errorToDisplay}
      />
    </div>
  );
};

export default Dashboard;
