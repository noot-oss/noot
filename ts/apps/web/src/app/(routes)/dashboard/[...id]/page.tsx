import { prisma } from "~web/server/db";
import { getServerAuthSession } from "~web/server/auth";
import { H1 } from "~ui/components/Typography";
import { Button } from "~ui/components/Button";
import Link from "next/link";
import { DashboardMetricsInnerPage } from "@noot/ui/src/pages/Dashboard/Metrics/DashboardMetricsInnerPage";

const DashboardOwnPage = async ({
  params,
}: {
  params: {
    id: string | string[];
  };
}) => {
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const user = await getServerAuthSession();

  const userBox = await prisma.box.findUnique({
    where: {
      id: id,
      ownerId: user.user.id,
    },
  });

  const userBoxesCount = await prisma.box.count({
    where: {
      ownerId: user.user.id,
    },
  });

  if (!userBox) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-8">
        <H1 className="text-center">No box found with id {id}</H1>
        <Button asChild size="lg">
          <Link href="/dashboard" className="text-2xl">
            Return home
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <DashboardMetricsInnerPage
      lineGraphData={{
        data: [],
        index: "",
        categories: [],
      }}
      uptimeTrackerData={[]}
      currentData={{
        co2: {
          value: 500,
          delta: "increase",
        },
        humidity: {
          value: 50,
          delta: "increase",
        },
        temperature: {
          value: 20,
          delta: "increase",
        },
      }}
      boxData={{
        name: userBox.name,
      }}
      userBoxesCount={userBoxesCount}
    />
  );
};

export default DashboardOwnPage;
