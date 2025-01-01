import * as net from "net";
import { rootHandler } from "./handlers";
import Logger from "./utils/logger";

const PORT = 3000;

const server = net.createServer((socket) => {
  socket.on("data", async (data) => {
    const response = await rootHandler();
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
