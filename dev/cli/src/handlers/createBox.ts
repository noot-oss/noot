import { Choice } from "../utils/choice";
import chalk from "chalk";
import ora from "ora";
import { client } from "../utils/client";

new Choice("createBox", async () => {
  console.log(chalk.cyan("Creating a new box..."));

  const spinner = ora(chalk.cyan("Generating init code...")).start();

  // const result = await axios
  //   .post("http://localhost:3000/api/trpc/external.initBox", {
  //     headers: {
  //       "init-code": "test",
  //     },
  //   })
  //   .catch((err) => {
  //     spinner.stop();
  //     console.log(chalk.redBright(err.cause ?? err));
  //   });

  const result = await client.initBox.mutate();
});
