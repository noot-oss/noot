import { CreateBoxCode } from "~/components/create/CreateBoxCode";

const CreatePage = () => {
  return (
    <div className="flex h-full flex-col items-center gap-16">
      <h1 className="text-center text-4xl font-bold md:text-6xl">
        Create A Box
      </h1>
      <CreateBoxCode />
    </div>
  );
};

export default CreatePage;
