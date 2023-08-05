import { H1 } from "~ui/components/Typography";
import type { Box } from "~ui/lib/Box";
import { DashboardMultiBox } from "./DashboardMultiBox";
import { Button } from "~ui/components/Button";
import Link from "next/link";

export const DashboardInnerPage = (props: { userBoxes: Box[] }) => {
  if (props.userBoxes.length === 0) {
    return (
      <div className="flex flex-col gap-6 text-center">
        <h1 className="text-5xl font-bold tracking-wider">
          We didn{"'"}t find any boxes for you.
        </h1>
        <h2 className="text-xl font-normal">
          You can create a new box by clicking the button below, or by clicking
          the {'"'}Create Box{'"'} button in the navbar.
        </h2>
        <Button
          className={"mx-auto w-fit"}
          variant={"default"}
          color="primary"
          size="lg"
          asChild
        >
          <Link href={"/create"}>Create Box</Link>
        </Button>
      </div>
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
