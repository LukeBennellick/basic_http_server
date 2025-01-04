import { NotFound404Handler } from "../..";

import fs from "fs";
import path from "path";
import Logger from "../../../utils/logger";
import { CRLF, HTTP_VERSION, STATUS_201 } from "../../../shared/http_constants";
import { parseBody, parseIncomingPathData } from "../../../utils/http";
import { UnprocessableEntity422Handler } from "../../errors/unprocessable_entity";

export const CreateFileHandler = async (
  directory: string,
  requestData = ""
) => {
  const parsedData = parseIncomingPathData(requestData);
  const fileName = parsedData[1];
  Logger.info(`Creating file: ${fileName}`);
  const filePath = path.join(directory, fileName);
  Logger.info(`Path for new file: ${filePath}`);
  try {
    const body = parseBody(requestData);
    await fs.promises.writeFile(filePath, body);

    Logger.info(`Written new file with content: ${body}`);
    const response = `${HTTP_VERSION} ${STATUS_201}${CRLF}${CRLF}`;
    Logger.info("Response built:", { responseString: response });
    return response;
  } catch (error) {
    Logger.error("Something went wrong creating the file", error);
    const response = UnprocessableEntity422Handler();
    return response;
  }
};
