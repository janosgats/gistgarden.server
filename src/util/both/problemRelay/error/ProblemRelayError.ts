import ProblemMarker from "../model/ProblemMarker";

export default class ProblemRelayError extends Error {

  marker: ProblemMarker;

  payload: any;

  constructor(
      marker: ProblemMarker,
      payload: any | null,
      message?: string | null,
  ) {
    super(message as string);

    this.marker = marker;

    this.payload = payload;
  }
}
