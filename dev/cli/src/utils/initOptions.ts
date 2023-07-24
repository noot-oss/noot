import chalk from "chalk";
import inquirer from "inquirer";

export const initOptions = () => {
  console.log(chalk.blueBright("Welcome to the NootBox Development CLI"));

  inquirer
    .prompt<{
      initOptions: "createBox" | "sendData";
    }>([
      {
        type: "list",
        name: "initOptions",
        message: "What would you like to do?",
        choices: [
          {
            name: "Create a new box",
            value: "createBox",
          },
          {
            name: "Send data to the api",
            value: "sendData",
          },
        ],
      },
    ])
    .then((onSelect) => {
      console.log(onSelect.initOptions);
    });
};
