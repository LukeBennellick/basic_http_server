import * as net from "net";
import { rootHandler } from "./handlers";
import Logger from "./utils/logger";
import { parseVerbAndBasePathFromRequestBuffer } from "./utils/http";

const PORT = 3000;

export type Handlers = {
  [key: string]: (
    verb: string,
    requestData: string,
    opts?: object
  ) => Promise<string> | Promise<Buffer>;
};

const handlers: Handlers = {
  "/": (verb: string, incomingData: string) => {
    switch (verb) {
      case "GET": {
        console.log("/ path");
        const response = rootHandler(incomingData);
        return response;
      }
      default:
        console.log("Default path");
        const response = rootHandler(incomingData);
        return response;
    }
  },
};

const server = net.createServer((socket) => {
  socket.on("data", async (data: Buffer) => {
    const { verb, basePath } = parseVerbAndBasePathFromRequestBuffer(data);

    const handler = handlers[basePath];
    const response = await handler(verb, data.toString());
    socket.write(response);
    socket.end();
  });

  socket.on("close", () => {
    socket.end();
  });
});

server.listen(PORT, "localhost", () => {
  Logger.info(`Server running on port ${PORT}`);
});
