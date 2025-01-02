import { CRLF } from "../shared/http_constants";
import Logger from "./logger";

const VALID_VERBS = ["GET"] as const;
const BASE_PATH_REGEX = /\/[^/]*/g;

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
  const fullPathAsArray = fullPath.match(BASE_PATH_REGEX) || "";

  // Build the object with the verb, and the first part of the path (base path).
  const ParsedHTTPRequestData: ParsedHTTPRequestData = {
    verb: httpVerb,
    basePath: fullPathAsArray[0],
  };

  return ParsedHTTPRequestData;
};
