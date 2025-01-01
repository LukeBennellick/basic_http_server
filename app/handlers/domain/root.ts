import { CRLF, HTTP_VERSION, STATUS_200 } from "../../shared/constants";

export const rootHandler = async (requestData = "") => {
  const response = `${HTTP_VERSION} ${STATUS_200}${CRLF}Content-Type: text/plain${CRLF}${CRLF} Root Path`;
  return response;
};
