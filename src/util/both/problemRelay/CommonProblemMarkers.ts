import ProblemMarker, {MatchingProblemMarker, problemMarkerOf} from "./model/ProblemMarker";
import {ProblemRelayConstants} from "./ProblemRelayConstants";

function matcherOf(domain: string, mainTypeId: number, subTypeId: number): MatchingProblemMarker {
    const marker = problemMarkerOf(domain, mainTypeId, subTypeId);
    return MatchingProblemMarker.of(marker);
}

type ProblemMarkerWithoutDomain = Omit<ProblemMarker, 'domain'>

function srvMarkerOf(marker: ProblemMarkerWithoutDomain): MatchingProblemMarker {
    return MatchingProblemMarker.of({
        ...marker,
        domain: ProblemRelayConstants.DOMAIN.GgSrv,
    });
}

const CommonProblemMarkers = {
    GgCommon: {
        InvalidFields: {
            INVALID_FIELDS: matcherOf(ProblemRelayConstants.DOMAIN.GgWs, 1, 1),
        },
    },
    GgSrv: {
        UserAuth: {
            NO_USER_IS_LOGGED_IN: srvMarkerOf({
                mainTypeId: 1,
                mainTypeName: 'UserAuth',
                subTypeId: 1,
                subTypeName: 'NO_USER_IS_LOGGED_IN',
            }),
        },
    },
};

export default CommonProblemMarkers;
