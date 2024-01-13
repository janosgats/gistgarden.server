import ReceivedProblem from "../model/ReceivedProblem";
import ProblemRelayError from "./ProblemRelayError";

export default class ReceivedProblemRelayError extends ProblemRelayError {
  receivedProblem: ReceivedProblem;

  constructor(
    problem: ReceivedProblem,
  ) {
    super(
      problem.marker,
      problem.payload,
      problem.message,
    );

    this.receivedProblem = problem;
  }
}
