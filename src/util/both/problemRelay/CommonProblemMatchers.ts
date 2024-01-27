import {MatchingProblemMarker, problemMarkerOf} from "./model/ProblemMarker";
import {ProblemRelayConstants} from "./ProblemRelayConstants";

function matcherOf(domain: string, mainTypeId: number, subTypeId: number): MatchingProblemMarker {
    const marker = problemMarkerOf(domain, mainTypeId, subTypeId);
    return MatchingProblemMarker.of(marker);
}

const CommonProblemMatchers = {
    PpCommon: {
        InvalidFields: {
            INVALID_FIELDS: matcherOf(ProblemRelayConstants.DOMAIN.GgWs, 1, 1),
        },
    },
};

export default CommonProblemMatchers;
