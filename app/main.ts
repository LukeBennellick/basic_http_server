import * as net from "net";
import { rootHandler } from "./handlers";

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

server.listen(4221, "localhost", () => {
  console.log("Server running on 4221");
});
