import { NotFound404Handler } from "../..";

import fs from "fs";
import path from "path";
import Logger from "../../../utils/logger";
import { CRLF, HTTP_VERSION, STATUS_200 } from "../../../shared/http_constants";
import { parseIncomingPathData } from "../../../utils/http";

export const getFileHandler = async (directory: string, requestData = "") => {
  const parsedData = parseIncomingPathData(requestData);
  const fileName = parsedData[1];
  Logger.info(`Getting file: ${fileName}`);
  const filePath = path.join(directory, fileName);
  Logger.info(`Path for file: ${filePath}`);
  try {
    const fileStat = fs.statSync(filePath);
    const contentLength = fileStat.size;
    const fileContent = fs.readFileSync(filePath);
    Logger.info(`Found file at path: ${filePath}`);

    const response = `${HTTP_VERSION} ${STATUS_200}${CRLF}Content-Length: ${contentLength}${CRLF}Content-Type: application/octet-stream${CRLF}${CRLF}${fileContent}`;
    Logger.info("Response built:", { responseString: response });
    return response;
  } catch {
    Logger.error(`Unable to locale file at: ${filePath}`);
    const response = NotFound404Handler();
    return response;
  }
};
