import {
  CRLF,
  HTTP_VERSION,
  STATUS_404,
  STATUS_422,
} from "../../shared/http_constants";
import Logger from "../../utils/logger";

export const UnprocessableEntity422Handler = async () => {
  Logger.warn("UnprocessableEntity422Handler executed");
  const response = `${HTTP_VERSION} ${STATUS_422}${CRLF}${CRLF}`;
  return response;
};
