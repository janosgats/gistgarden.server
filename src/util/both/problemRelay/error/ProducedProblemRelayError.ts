import ProblemMarker from "../model/ProblemMarker";
import ProblemRelayError from "./ProblemRelayError";

export default class ProducedProblemRelayError extends ProblemRelayError {

  suggestedHttpResponseCode: number;

  constructor(
    marker: ProblemMarker,
    payload: any | null,
    message: string | null,
    suggestedHttpResponseCode: number,
  ) {
    super(
      marker,
      payload,
      message,
    );
    this.suggestedHttpResponseCode = suggestedHttpResponseCode;
  }
}
