import ProblemMarker from "./ProblemMarker";

export default interface ReceivedProblem {
  version: string,
  responseStatus: number,
  responseBody: Record<string, any>,

  marker: ProblemMarker,

  message: string,

  payload: any,
  payloadSerializationSucceeded: boolean,

  timestamp: string,
}