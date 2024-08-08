import { createServer } from "node:http";
import { setInterval } from "node:timers";
import { spawn } from "node:child_process";
import { createReadStream } from "node:fs";
import "./awsAppConfig.js";

setInterval(() => {
  console.log(
    `[${new Date().toISOString()}]: Pulling config from AWS AppConfig and updating local cache`
  );
  spawn("node", ["awsAppConfig.js"]);
}, 10000);

const server = createServer((_req, res) => {
  createReadStream("./config.json").pipe(res);
});

server.listen(8000, "localhost", () => {
  console.log("Server listening on port 8000");
});
