import { Choice } from "../utils/choice";
import chalk from "chalk";
import ora from "ora";
import inquirer from "inquirer";
import axios, { AxiosError } from "axios";
import { Prisma } from "@prisma/client";

new Choice("createBox", async () => {
  console.log(chalk.cyan("Creating a new box..."));

  // Enter a code
  const { code } = await inquirer.prompt<{ code: string }>([
    {
      type: "input",
      name: "code",
      message: "Enter the code from the web app",
    },
  ]);

  const parsedCode = code.replace("-", "").trim();

  const sendReq = ora("Sending request to the server").start();

  try {
    const result = await axios.post<{
      id: string;
      token: string;
    }>("http://localhost:8787/verify", {
      code: parsedCode,
    });

    sendReq.succeed(
      "Successfully verified box, box id is " +
        result.data.id +
        " and token is " +
        result.data.token
    );
  } catch (err) {
    const errAxios = err as AxiosError<{
      error?: string;
    }>;

    if (errAxios.response?.data?.error === "Invalid code") {
      sendReq.fail(chalk.red("Invalid Code"));

      throw new Error("Invalid Code");
    }
    sendReq.fail(
      chalk.red("Failed to send request to the server with error:", err)
    );
    throw new Error("Failed to send request to the server");
  }
});
