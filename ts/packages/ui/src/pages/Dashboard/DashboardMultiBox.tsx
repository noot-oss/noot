import { Box } from "~lib/Box.ts";
import { H1 } from "@components/Typography.tsx";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/Card.tsx";
import { Button } from "@components/Button.tsx";

const DashboardBox = ({ box }: { box: Box }) => {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="text-3xl">{box.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{box.description}</p>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button className="mt-auto w-full">Continue</Button>
      </CardFooter>
    </Card>
  );
};

export const DashboardMultiBox = (props: { userBoxes: Box[] }) => {
  return (
    <div className="flex flex-col gap-8">
      <H1>Dashboard</H1>
      <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
        {props.userBoxes.map((box) => (
          <li key={box.id}>
            <DashboardBox box={box} />
          </li>
        ))}
      </ul>
    </div>
  );
};
