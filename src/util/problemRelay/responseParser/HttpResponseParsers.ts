import ReceivedProblem from "../model/ReceivedProblem";
import UnsupportedProblemRelayVersionError from "../error/UnsupportedProblemRelayVersionError";
import {parseProblemMarker} from "../model/ProblemMarker";
import {ProblemRelayConstants} from "../ProblemRelayConstants";
import {AxiosResponseHeaders, RawAxiosResponseHeaders} from "axios";

export type  UnifiedAxiosResponseHeaders = RawAxiosResponseHeaders | AxiosResponseHeaders;

export function parseReceivedProblemRelayResponse(responseCode: number,
                                                  headers: UnifiedAxiosResponseHeaders,
                                                  receivedBody: string | Record<string, string> | any,
): null | ReceivedProblem {
  const receivedVersion = getReceivedVersion(headers);


  switch (receivedVersion) {
    case "1": {
      return parseResponseForVersion1(receivedVersion, responseCode, receivedBody);
    }
  }

  throw new UnsupportedProblemRelayVersionError(receivedVersion, "Unsupported ProblemRelay version received");
}


function getReceivedVersion(headers: UnifiedAxiosResponseHeaders): null | string {
  if (!headers || !Object.keys(headers).includes(ProblemRelayConstants.HTTP_HEADER_NAME_PROBLEM_RELAY_VERSION)) {
    return null;
  }

  const headerValue = headers[ProblemRelayConstants.HTTP_HEADER_NAME_PROBLEM_RELAY_VERSION];

  if (!Array.isArray(headerValue)) {
    return headerValue?.toString() || null;
  }

  if (headerValue.length === 0) {
    return null;
  }
  return headerValue[0]?.toString() || null;
}

function parseResponseForVersion1(receivedVersion: string, responseCode: number, responseBody: string | Record<string, string> | any): ReceivedProblem | null {
  if (!responseBody) {
    return null;
  }

  if (typeof responseBody === "string") {
    const parsingResult = tryToParseBody(responseBody);
    if (!parsingResult.success) {
      return null;
    }
    responseBody = parsingResult.data;
  }


  return {
    version: receivedVersion,
    responseStatus: responseCode,
    responseBody: responseBody,
    marker: parseProblemMarker(responseBody["marker"]),
    message: responseBody["message"],
    payload: responseBody["payload"],
    payloadSerializationSucceeded: ["true", "TRUE", true].includes(responseBody["payloadSerializationSucceeded"]),
    timestamp: responseBody["timestamp"],
  };
}


function tryToParseBody(wannabeJson: string): { success: boolean, data: any } {
  try {
    return {
      success: true,
      data: JSON.parse(wannabeJson),
    };
  } catch (e) {
    return {
      success: false,
      data: null,
    };
  }
}