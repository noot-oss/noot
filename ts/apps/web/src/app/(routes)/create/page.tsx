"use client";
import { useState } from "react";
import { api } from "~web/utils/api";
import { CreateInnerPage } from "@noot/ui/src/pages/Dashboard/DashboardInnerPage";
import { useRouter } from "next/navigation";

const CreateBoxPage = () => {
  const [hasRefetched, setHasRefetched] = useState(false);
  const router = useRouter();

  const userCode = api.box.fetchCode.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const foundBoxes = api.box.getBoxByVerificationCode.useQuery(
    {
      verificationCode: userCode.data
        ? userCode.data.verificationCode
        : undefined,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const refetchData = () => {
    setHasRefetched(true);
  };

  const errorToDisplay = hasRefetched
    ? foundBoxes.isError
      ? "too-many-requests"
      : "not-found"
    : undefined;

  return (
    <div className={"h-full"}>
      <CreateInnerPage
        code={userCode.data ? userCode.data.verificationCode : undefined}
        handleContinue={() => {
          if (foundBoxes.data.length > 0) {
            router.push(`/box/${foundBoxes.data[0].id}`);
          }
        }}
        isFetching={foundBoxes.isFetching}
        fetchedMessage={errorToDisplay}
      />
    </div>
  );
};

export default CreateBoxPage;
