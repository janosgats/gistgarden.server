import ReceivedProblem from "../model/ReceivedProblem";
import ProducedProblemRelayError from "../error/ProducedProblemRelayError";
import {ProblemRelayConstants} from "../ProblemRelayConstants";

export interface ProblemHeader {
  name: string,
  value: string
}

export interface ProblemRelayResponseInstructions {
  body: Record<string, any>;
  statusCode: number;
  header: ProblemHeader;
}

function headerOf(name: string, value: string): ProblemHeader {
  return {
    name: name,
    value: value,
  };
}

const ProblemRelayResponseFactory = {
  v1FromReceived: (problem: ReceivedProblem): ProblemRelayResponseInstructions => {
    const body = {
      marker: problem.marker,
      message: problem.message,
      payload: problem.payload,
      payloadSerializationSucceeded: problem.payloadSerializationSucceeded,
      timestamp: problem.timestamp,
    };

    return {
      body: body,
      statusCode: problem.responseStatus,
      header: headerOf(ProblemRelayConstants.HTTP_HEADER_NAME_PROBLEM_RELAY_VERSION, "1"),
    };
  },
  v1FromProduced: (problem: ProducedProblemRelayError): ProblemRelayResponseInstructions => {
    let payload = null;
    let payloadSerializationSucceeded = null;
    try {
      payload = JSON.parse(JSON.stringify(problem.payload));
      payloadSerializationSucceeded = true;
    } catch (e) {
      payloadSerializationSucceeded = false;
    }

    const body = {
      marker: problem.marker,
      message: problem.message,
      payload: payload,
      payloadSerializationSucceeded: payloadSerializationSucceeded,
      timestamp: new Date().toISOString(),
    };

    return {
      body: body,
      statusCode: problem.suggestedHttpResponseCode || 500,
      header: headerOf(ProblemRelayConstants.HTTP_HEADER_NAME_PROBLEM_RELAY_VERSION, "1"),
    };
  },
};

export default ProblemRelayResponseFactory;