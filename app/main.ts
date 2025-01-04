import * as net from "net";
import { NotFound404Handler, RootHandler } from "./handlers";
import Logger from "./utils/logger";
import { parseVerbAndBasePathFromRequestBuffer } from "./utils/http";
import { MethodNotAllowed405Handler } from "./handlers/errors/method_not_allowed";

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
        const response = RootHandler(incomingData);
        return response;
      }
      default: {
        const response = MethodNotAllowed405Handler(["GET"]);
        return response;
      }
    }
  },
};

const VALID_PATHS = Object.keys(handlers);

const server = net.createServer((socket) => {
  socket.on("data", async (data: Buffer) => {
    const { verb, basePath } = parseVerbAndBasePathFromRequestBuffer(data);

    if (basePath && VALID_PATHS.includes(basePath)) {
      const handler = handlers[basePath];
      const response = await handler(verb, data.toString());
      socket.write(response);
      socket.end();
    } else {
      const handler = NotFound404Handler;
      const response = await handler();
      socket.write(response);
      socket.end();
    }
  });

  socket.on("close", () => {
    socket.end();
  });
});

server.listen(PORT, "localhost", () => {
  Logger.info(`Server running on port ${PORT}`);
});
