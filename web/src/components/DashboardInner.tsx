import { type UserBoxReturned } from "~/server/api/routers/boxWebRouter";
import { Button } from "@nextui-org/button";

interface DashboardInnerProps {
  userBoxes: UserBoxReturned[];
  userName: string;
}

const NoBoxesFound = (props: { userName: DashboardInnerProps["userName"] }) => {
  return (
    <div className="flex flex-col gap-6 text-center">
      <h1 className="text-5xl font-bold tracking-wider">
        We didn{"'"}t find any boxes for you, {props.userName}
      </h1>
      <h2 className="text-xl font-normal">
        You can create a new box by clicking the button below, or by clicking
        the {'"'}Create Box{'"'} button in the navbar.
      </h2>
      <Button
        className={"mx-auto w-fit"}
        variant="shadow"
        color="primary"
        size="lg"
      >
        Create Box
      </Button>
    </div>
  );
};

export const DashboardInner = (props: DashboardInnerProps) => {
  return (
    <div className={"flex h-full grow flex-col items-center justify-center"}>
      {props.userBoxes.length === 0 ? (
        <NoBoxesFound userName={props.userName} />
      ) : null}
    </div>
  );
};
