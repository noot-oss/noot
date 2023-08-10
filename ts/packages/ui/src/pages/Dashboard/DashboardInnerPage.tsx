"use client";

import { H1 } from "~ui/components/Typography";
import type { Box } from "~ui/lib/Box";
import { DashboardMultiBox } from "./DashboardMultiBox";
import { Button } from "~ui/components/Button";
import { CreateBoxLoadedCode } from "../Create/CreateBoxLoadedCode";

const StepSection = (props: { children: React.ReactNode }) => (
  <section className="flex flex-col gap-4">{props.children}</section>
);

const StepTitle = (props: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-bold">{props.children}</h2>
);

export const DashboardInnerPage = (props: {
  userBoxes: Box[];
  code?: string;
  refetch?: () => void;
  isFetching?: boolean;
  fetchedMessage?: "not-found" | "too-many-requests" | "";
}) => {
  if (props.userBoxes.length === 0) {
    return (
      <div className="flex h-full flex-col items-center">
        <H1>Create A Box</H1>
        <h2 className="my-4 text-center text-xl">
          It{"'"}s so easy to set up a new NootBox! Just follow our 3 step guide
          and
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
              onClick={() => props.refetch?.()}
              disabled={props.isFetching}
            >
              Continue
            </Button>
            {props.fetchedMessage &&
              (props.fetchedMessage === "not-found" ? (
                <p className="text-red-500">No NootBox found with that code.</p>
              ) : (
                <p className="text-red-500">
                  Too many requests. Try again later.
                </p>
              ))}
          </StepSection>
        </div>
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
