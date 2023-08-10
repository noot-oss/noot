import { DashboardInnerPage } from "../../pages/Dashboard/DashboardInnerPage";
import { mockBox } from "~ui/lib/Box";
import { PageWrapper } from "~ui/components/PageWrapper";
import { type ComponentProps, useState } from "react";

const mockMultipleUserBoxes = Array.from({ length: 4 }).map(() => mockBox());

export const DashboardPageWithMultipleBoxes = () => (
  <PageWrapper>
    <DashboardInnerPage userBoxes={mockMultipleUserBoxes} />
  </PageWrapper>
);

type DashboardInnerPageProps = ComponentProps<typeof DashboardInnerPage>;

export const DashboardPageWithNoBoxes = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [fetchedMessage, setFetchedMessage] =
    useState<DashboardInnerPageProps["fetchedMessage"]>("");

  const refetch = () => {
    setIsFetching(true);
    setTimeout(() => {
      setIsFetching(false);
      setFetchedMessage("too-many-requests");
    }, 1000);
  };

  return (
    <PageWrapper>
      <DashboardInnerPage
        userBoxes={[]}
        code={"12341234"}
        isFetching={isFetching}
        refetch={refetch}
        fetchedMessage={fetchedMessage}
      />
    </PageWrapper>
  );
};
