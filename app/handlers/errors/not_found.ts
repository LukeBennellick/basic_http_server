import { CRLF, HTTP_VERSION, STATUS_404 } from "../../shared/http_constants";
import Logger from "../../utils/logger";

export const NotFound404Handler = async () => {
  Logger.warn("NotFound404Handler executed");
  const response = `${HTTP_VERSION} ${STATUS_404}${CRLF}${CRLF}`;
  return response;
};
