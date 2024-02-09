import ProblemMarker from "../model/ProblemMarker";
import ProblemRelayError from "./ProblemRelayError";

export default class ProducedProblemRelayError extends ProblemRelayError {

  suggestedHttpResponseCode?: number | null;

  constructor(
      marker: ProblemMarker,
      payload?: any | null,
      message?: string | null,
      suggestedHttpResponseCode?: number | null,
  ) {
    super(
      marker,
      payload,
      message,
    );
    this.suggestedHttpResponseCode = suggestedHttpResponseCode;
  }
}
