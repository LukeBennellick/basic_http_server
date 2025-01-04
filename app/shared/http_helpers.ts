import { CRLF } from "./http_constants";

export const parseIncomingHeaders = (
  incomingData: string
): Record<string, string> => {
  const lines = incomingData.split(CRLF);
  const headerLines = lines.slice(1);

  const headers: Record<string, string> = {};

  for (const line of headerLines) {
    if (line === "") {
      break;
    }
    const [key, ...values] = line.split(":");
    const value = values.join(":").trim();

    if (key) {
      headers[key.toLowerCase()] = value;
    }
  }
  return headers;
};
