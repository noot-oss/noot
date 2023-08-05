import { DashboardInnerPage } from "../../pages/Dashboard/DashboardInnerPage";
import { mockBox } from "~ui/lib/Box";

const mockMultipleUserBoxes = Array.from({ length: 4 }).map(() => mockBox());

export const DashboardPage = () => (
  <DashboardInnerPage userBoxes={mockMultipleUserBoxes} />
);
