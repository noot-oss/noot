import { DashboardInnerPage } from "../../pages/Dashboard/DashboardInnerPage.tsx";
import { mockBox } from "~lib/Box.ts";

const mockMultipleUserBoxes = Array.from({ length: 4 }).map(() => mockBox());

export const DashboardPage = () => (
  <DashboardInnerPage userBoxes={mockMultipleUserBoxes} />
);
