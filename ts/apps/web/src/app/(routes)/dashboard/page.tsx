"use client";

import { api } from "~web/utils/api";
import { useSession } from "next-auth/react";
import { DashboardInnerPage } from "@noot/ui/src/pages/Dashboard/DashboardInnerPage";

const Dashboard = () => {
  const user = useSession();

  const {
    refetch: refetchUserBoxes,
    data: userBoxesData,
    isFetching: isFetchingUserBoxes,
    isError: userBoxIsError,
    error: userBoxError,
    failureReason: userBoxFailureReason,
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
    refetchUserBoxes();
  };

  console.log(userBoxError.message);

  return (
    <div className={"h-full"}>
      <DashboardInnerPage
        userBoxes={boxesToRender}
        code={userCode.data.verificationCode}
        refetch={refetchData}
        isFetching={isFetchingUserBoxes}
        fetchedMessage={""}
      />
    </div>
  );
};

export default Dashboard;
