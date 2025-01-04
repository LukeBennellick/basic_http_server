import { CRLF } from "../shared/http_constants";
import Logger from "./logger";

const VALID_VERBS = ["GET"] as const;
const PATH_SPLIT_REGEX = /\/[^/]*/g;

type ParsedHTTPRequestData = {
  verb: (typeof VALID_VERBS)[number];
  basePath: string;
};

export const parseVerbAndBasePathFromRequestBuffer = (
  data: Buffer
): ParsedHTTPRequestData => {
  // Cast the incoming buffer to string
  const dataToString = data.toString();
  // Split the string on new lines, get the first element (VERB, Path, HTTP version)
  const requestLine = dataToString.split(CRLF)[0];
  // Further break this down into three strings
  const requestLineAsArray = requestLine.split(" ");
  // The element at index 0 will always be the path as per the HTTP spec
  const httpVerb = requestLineAsArray[0] as (typeof VALID_VERBS)[0];
  // The element at index 1 will always be the path as per the HTTP spec
  const fullPath = requestLineAsArray[1];
  // Break down the path into an array
  const fullPathAsArray = fullPath.match(PATH_SPLIT_REGEX) || "";

  // Build the object with the verb, and the first part of the path (base path).
  const ParsedHTTPRequestData: ParsedHTTPRequestData = {
    verb: httpVerb,
    basePath: fullPathAsArray[0],
  };

  return ParsedHTTPRequestData;
};

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

export const parseBody = (incomingData: string): string => {
  const lines = incomingData.split(CRLF);
  const indexOfEmptyString = lines.findIndex((line) => line === "");
  const indexOfBody = indexOfEmptyString + 1;
  return lines[indexOfBody];
};

export const verifyGZIPEncoding = (incomingData: string): boolean => {
  const headers = parseIncomingHeaders(incomingData);
  const encodingAccepted = headers["accept-encoding"]?.split(", ");
  if (encodingAccepted && encodingAccepted.includes("gzip")) {
    return true;
  }

  return false;
};

export const parseIncomingPathData = (incomingData: string): string[] => {
  const requestLine = incomingData.split(CRLF)[0];
  const requestLinePath = requestLine.split(" ")[1];
  const requestLinePathParsedArray = requestLinePath.match(PATH_SPLIT_REGEX);
  console.log("TJHE ARR", requestLinePathParsedArray);
  return requestLinePathParsedArray || [];
};
