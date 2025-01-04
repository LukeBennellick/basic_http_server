import * as net from "net";
import { NotFound404Handler, RootHandler } from "./handlers";
import Logger from "./utils/logger";
import { parseVerbAndBasePathFromRequestBuffer } from "./utils/http";
import { MethodNotAllowed405Handler } from "./handlers/errors/method_not_allowed";
import { UserAgentHandler } from "./handlers/domain/user_agent";
import { EchoHandler } from "./handlers/domain/echo";
import { CreateFileHandler } from "./handlers/domain/files/create_file";
import { getFileHandler } from "./handlers/domain/files/get_file";

const PORT = 3000;
const args = process.argv;
const directoryIndex = args.indexOf("--directory");
const FILE_DIRECTORY = args[directoryIndex + 1];

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
  "/user-agent": async (verb: string, incomingData: string) => {
    switch (verb) {
      case "GET": {
        const response = UserAgentHandler(incomingData);
        return response;
      }
      default:
        const response = await MethodNotAllowed405Handler(["GET"]);
        return response;
    }
  },
  "/echo": (verb, incomingData) => {
    switch (verb) {
      case "GET": {
        const response = EchoHandler(incomingData);
        return response;
      }
      default:
        const response = MethodNotAllowed405Handler(["GET"]);
        return response;
    }
  },
  "/files": (verb, incomingData) => {
    switch (verb) {
      case "GET": {
        const response = getFileHandler(FILE_DIRECTORY, incomingData);
        return response;
      }
      case "POST": {
        const response = CreateFileHandler(FILE_DIRECTORY, incomingData);
        return response;
      }
      default:
        const response = MethodNotAllowed405Handler(["GET", "POST"]);
        return response;
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
