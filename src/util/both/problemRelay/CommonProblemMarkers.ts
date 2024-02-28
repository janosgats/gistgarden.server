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
            INVALID_FIELDS: matcherOf(ProblemRelayConstants.DOMAIN.GgCommon, 1, 1),
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
    GgWs: {
        Registration: {
            EMAIL_PASSWORD_REGISTRATION_INQUIRY_NOT_FOUND: matcherOf(ProblemRelayConstants.DOMAIN.GgWs, 8, 1),
            EMAIL_IS_ALREADY_TAKEN: matcherOf(ProblemRelayConstants.DOMAIN.GgWs, 8, 2),
            EMAIL_PASSWORD_REGISTRATION_INQUIRY_IS_EXPIRED: matcherOf(ProblemRelayConstants.DOMAIN.GgWs, 8, 3),
        },
    },
};

export default CommonProblemMarkers;
