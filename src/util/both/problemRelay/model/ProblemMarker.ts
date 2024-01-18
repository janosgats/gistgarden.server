import ReceivedProblem from "./ReceivedProblem";
import ProblemRelayError from "../error/ProblemRelayError";

export default interface ProblemMarker {
  domain: string;
  mainTypeId: number;
  mainTypeName?: string;
  subTypeId: number;
  subTypeName?: string;
}

export class MatchingProblemMarker implements ProblemMarker {
  domain: string;
  mainTypeId: number;
  mainTypeName?: string;
  subTypeId: number;
  subTypeName?: string;

  constructor(marker: ProblemMarker) {
    this.domain = marker.domain;
    this.mainTypeId = marker.mainTypeId;
    this.mainTypeName = marker.mainTypeName;
    this.subTypeId = marker.subTypeId;
    this.subTypeName = marker.subTypeName;
  }

  matches(toTest: ReceivedProblem | Error, ignoreSubType: boolean = false): boolean {
    if (toTest instanceof Error && !(toTest instanceof ProblemRelayError)) {
      return false;
    }

    return this.matchesMarker(toTest.marker, ignoreSubType);
  }

  matchesMarker(toTest: ProblemMarker, ignoreSubType: boolean = false): boolean {
    return areMarkersEqual(this, toTest, ignoreSubType);
  }

  static of(marker: ProblemMarker): MatchingProblemMarker {
    return new MatchingProblemMarker(marker);
  }
}

export function areMarkersEqual(a: ProblemMarker, b: ProblemMarker, ignoreSubType: boolean = false) {
  if (a.domain !== b.domain || a.mainTypeId !== b.mainTypeId) {
    return false;
  }
  return ignoreSubType || a.subTypeId === b.subTypeId;
}

export function parseProblemMarker(toParse: Record<string, string | number>): ProblemMarker {
  return {
    domain: toParse["domain"]?.toString(),
    mainTypeId: Number.parseInt(toParse["mainTypeId"] as string),
    subTypeId: Number.parseInt(toParse["subTypeId"] as string),
    mainTypeName: toParse["mainTypeName"]?.toString(),
    subTypeName: toParse["subTypeName"]?.toString(),
  };
}

export function problemMarkerOf(domain: string, mainTypeId: number, subTypeId: number): ProblemMarker {
  return {
    domain: domain,
    mainTypeId: mainTypeId,
    subTypeId: subTypeId,
  };
}
