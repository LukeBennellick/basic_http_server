import { CRLF, HTTP_VERSION, STATUS_200 } from "../../shared/http_constants";

export const RootHandler = async (requestData = "") => {
  const body = "Root Path";
  const contentLength = body.length;
  const response = `${HTTP_VERSION} ${STATUS_200}${CRLF}Content-Length: ${contentLength}${CRLF}Content-Type: text/plain${CRLF}${CRLF}Root Path`;
  return response;
};
