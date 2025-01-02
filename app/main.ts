import * as net from "net";
import { rootHandler } from "./handlers";
import Logger from "./utils/logger";
import { parseVerbAndBasePathFromRequestBuffer } from "./utils/http";

const PORT = 3000;

const server = net.createServer((socket) => {
  socket.on("data", async (data: Buffer) => {
    const { verb, basePath } = parseVerbAndBasePathFromRequestBuffer(data);

    console.log("We should now have the verb and basepath", verb, basePath);
    socket.end();
  });

  socket.on("close", () => {
    socket.end();
  });
});

server.listen(PORT, "localhost", () => {
  Logger.info(`Server running on port ${PORT}`);
});
