import { CRLF, HTTP_VERSION, STATUS_405 } from "../../shared/http_constants";
import Logger from "../../utils/logger";

export const MethodNotAllowed405Handler = async (allowedMethods: string[]) => {
  Logger.warn("MethodNotAllowed405Handler executed");
  return `${HTTP_VERSION} ${STATUS_405}\r\nAllow: ${allowedMethods.join(
    ", "
  )}${CRLF}${CRLF}`;
};
