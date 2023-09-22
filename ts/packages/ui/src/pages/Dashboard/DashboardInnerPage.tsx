"use client";

import { H1 } from "~ui/components/Typography";
import type { Box } from "~ui/lib/Box";
import { DashboardMultiBox } from "./DashboardMultiBox";
import { Button } from "~ui/components/Button";
import { CreateBoxLoadedCode } from "../Create/CreateBoxLoadedCode";
import { DashboardMetricsInnerPage } from "./Metrics/DashboardMetricsInnerPage";
import PulseLoader from "react-spinners/PulseLoader";
import { Skeleton } from "~ui/components/Skeleton";

interface DashboardInnerPageProps {
  userBoxes: Box[];
  code?: string;
  handleContinue?: () => void;
  isFetching?: boolean;
  fetchedMessage?: "not-found" | "too-many-requests" | "";
}

const StepSection = (props: { children: React.ReactNode }) => (
  <section className="flex flex-col gap-4">{props.children}</section>
);

const StepTitle = (props: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-bold">{props.children}</h2>
);

export const SkeletonLoading = () => (
  <div className="flex flex-col gap-8">
    <Skeleton className="h-16 w-full sm:w-[20rem]" />
    <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 2 }).map((box, index) => (
        <li key={`skeleton-${index}`}>
          <Skeleton className="flex h-full flex-col p-6">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="my-4 flex h-6 w-5/6" />

            <Skeleton className="h-12 w-full" />
          </Skeleton>
        </li>
      ))}
    </ul>
  </div>
);

export const CreateInnerPage = (
  props: Omit<DashboardInnerPageProps, "userBoxes">
) => (
  <div className="flex h-full flex-col items-center">
    <H1>Create A Box</H1>
    <h2 className="my-4 text-center text-xl">
      It{"'"}s so easy to set up a new NootBox! Just follow our 3 step guide and
      <br />
      you{"'"}ll be on your way to monitoring your environment!
    </h2>
    <div className="mt-16 flex w-full flex-col gap-16 md:grid md:grid-cols-3 md:grid-rows-1">
      <StepSection>
        <StepTitle>1. Plug in your NootBox</StepTitle>
        {/*TODO: Animation of plugging in NootBox*/}
        <div className="h-96 w-full rounded-md bg-white/10"></div>
      </StepSection>
      <StepSection>
        <StepTitle>2. Visit myip:1234</StepTitle>
        {/*TODO: Animation of plugging in NootBox*/}
        <div className="mt-auto h-96 w-full rounded-md bg-white/10"></div>
      </StepSection>
      <StepSection>
        <StepTitle>3. Enter the following code:</StepTitle>
        {props.code ? (
          <CreateBoxLoadedCode verificationCode={props.code} />
        ) : (
          <h2 className="text-2xl font-bold">Loading...</h2>
        )}
        <Button
          className={"mt-2"}
          size={"lg"}
          onClick={() => props.handleContinue?.()}
          disabled={props.isFetching}
        >
          Continue
        </Button>
        {props.fetchedMessage &&
          (props.fetchedMessage === "not-found" ? (
            <p className="text-red-500">No NootBox found with that code.</p>
          ) : (
            <p className="text-red-500">Too many requests. Try again later.</p>
          ))}
      </StepSection>
    </div>
  </div>
);

export const DashboardInnerPage = (props: DashboardInnerPageProps) => {
  const firstBoxName = props.userBoxes[0]?.name;

  if (props.isFetching) {
    return <SkeletonLoading />;
  }

  if (props.userBoxes.length === 0) {
    return <CreateInnerPage {...props} />;
  }

  if (props.userBoxes.length > 1) {
    return <DashboardMultiBox userBoxes={props.userBoxes} />;
  }

  return (
    <>
      <DashboardMetricsInnerPage
        lineGraphData={{
          data: [],
          index: "",
          categories: [],
        }}
        uptimeTrackerData={[]}
        // We know there is only one box from the checks above
        userBoxesCount={1}
        currentData={{
          co2: {
            value: 400,
            delta: "increase",
          },
          temperature: {
            value: 20,
            delta: "increase",
          },
          humidity: {
            value: 50,
            delta: "increase",
          },
        }}
        boxData={{
          name: firstBoxName ?? "Loading...",
        }}
      />
    </>
  );
};
