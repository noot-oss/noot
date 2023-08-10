#!/usr/bin/env node

import { displayTitle } from "./utils/displayTitle";
import { initOptions } from "./utils/initOptions";
import "./utils/choice";
import "./handlers/createBox";
import axios from "axios";
import * as process from "process";

displayTitle();

// API Server
await axios.get("http://127.0.0.1:8787").catch((err) => {
  throw new Error("Server is not running at 127.0.0.1:8787");
});

// Next.js Server
await axios.get("http://localhost:3000").catch((err) => {
  throw new Error("Server is not running at http://localhost:3000");
});

initOptions();
