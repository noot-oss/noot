#!/usr/bin/env node

import { displayTitle } from "./utils/displayTitle";
import { initOptions } from "./utils/initOptions";
import "./utils/choice";
import "./handlers/createBox";
import axios from "axios";
import * as process from "process";

displayTitle();

const data = await axios.get("http://localhost:3000").catch((err) => {
  throw new Error("Server is not running at localhost:3000");
});

initOptions();
