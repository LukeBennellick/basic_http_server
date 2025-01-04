import { CRLF, HTTP_VERSION, STATUS_200 } from "../../shared/http_constants";
import { parseIncomingPathData, verifyGZIPEncoding } from "../../utils/http";
import Logger from "../../utils/logger";
import { gzipSync } from "zlib";

export const EchoHandler = async (requestData: string) => {
  Logger.info("Calling echoHandler");
  const parsedData = parseIncomingPathData(requestData);
  const compressionAsGzip = verifyGZIPEncoding(requestData);

  let responseBody = parsedData[1];
  let gzipEncoding = "";

  if (compressionAsGzip) {
    Logger.info("Gzip compression supported by client");
    gzipEncoding = `Content-Encoding: gzip${CRLF}`;
    Logger.info("Compressing response body");
    responseBody = gzipSync(Buffer.from(responseBody)) as unknown as string;
  }

  const headers = `${HTTP_VERSION} ${STATUS_200}${CRLF}Content-Length: ${responseBody.length}${CRLF}${gzipEncoding}Content-Type: text/plain${CRLF}${CRLF}`;

  const response = Buffer.concat([
    Buffer.from(headers),
    Buffer.from(responseBody),
  ]);

  Logger.info("Response built");
  return response;
};
