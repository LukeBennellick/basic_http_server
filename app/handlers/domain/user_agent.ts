import { CRLF, HTTP_VERSION, STATUS_200 } from "../../shared/http_constants";
import { parseIncomingHeaders } from "../../utils/http";

export const UserAgentHandler = async (requestData: string) => {
  const headers = parseIncomingHeaders(requestData);
  const contentLength = headers["user-agent"].length;
  return `${HTTP_VERSION} ${STATUS_200}${CRLF}Content-Length: ${contentLength}${CRLF}Content-Type: text/plain${CRLF}${CRLF}${headers["user-agent"]}`;
};
