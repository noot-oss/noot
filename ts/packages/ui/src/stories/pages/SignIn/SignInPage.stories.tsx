import { PageWrapper } from "~ui/components/PageWrapper";
import { Provider, SignInInnerPage } from "../../../pages/SignIn/SignIn";

const mockProviders: Provider[] = [
  {
    name: "Google",
    onClick: () => console.log("Google clicked"),
  },
  {
    name: "Discord",
    onClick: () => console.log("Discord clicked"),
  },
];

export const DashboardPageWithMultipleBoxes = () => (
  <PageWrapper>
    <SignInInnerPage providers={mockProviders} />
  </PageWrapper>
);
