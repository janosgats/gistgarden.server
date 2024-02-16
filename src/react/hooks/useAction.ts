import React from 'react';
import {CallStatus} from '@/util/both/CallStatus';

export interface UseActionCommand<R, P> {
    actionFunction: (param: P) => Promise<R>;
}

export interface UsedAction<R, P> {
    pending: boolean;
    failed: boolean;
    succeeded: boolean;
    callStatus: CallStatus;

    result: R | null;

    run: (param: P) => Promise<R>;
}

const useAction = <R = void, P = void>({
                                           actionFunction,
                                       }: UseActionCommand<R, P>): UsedAction<R, P> => {
    const [result, setResult] = React.useState<R | null>(null);
    const [callStatus, setCallStatus] = React.useState<CallStatus>(CallStatus.OPEN);

    const runAction = async (param: P): Promise<R> => {
        setCallStatus(CallStatus.PENDING)
        setResult(null)

        return actionFunction(param)
            .then((executionResult) => {
                setResult(executionResult);
                setCallStatus(CallStatus.SUCCEEDED)
                return executionResult
            })
            .catch((err) => {
                setCallStatus(CallStatus.FAILED)
                setResult(null);
                throw err
            })
    };


    return {
        result: result,
        callStatus: callStatus,
        failed: callStatus === CallStatus.FAILED,
        pending: callStatus === CallStatus.PENDING,
        succeeded: callStatus === CallStatus.SUCCEEDED,
        run: runAction,
    };
};

export default useAction;
