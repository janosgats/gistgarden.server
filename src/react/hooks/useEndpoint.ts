import React from 'react';
import {AxiosRequestConfig, AxiosResponse} from 'axios';
import callServer from "@/util/frontend/callServer";

export interface UseEndpointCommand<T, R = T> {
    config: AxiosRequestConfig;
    deps?: ReadonlyArray<any>;
    customSuccessProcessor?: (axiosResponse: AxiosResponse<T>) => R;
    sendRequestOnDependencyChange?: boolean;
    initialPending?: boolean;
    keepDataOnRefresh?: boolean;
    onError?: () => void;
}

export interface UsedEndpoint<R> {
    data: R | null;

    pending: boolean;
    failed: boolean;
    succeeded: boolean;

    reloadEndpoint: () => void;
}

const useEndpoint = <T, R = T>({
                                   config,
                                   deps = [],
                                   customSuccessProcessor,
                                   sendRequestOnDependencyChange = true,
                                   initialPending = true,
                                   keepDataOnRefresh = false,
                                   onError,
                               }: UseEndpointCommand<T, R>): UsedEndpoint<R> => {
    const [data, setData] = React.useState<R | null>(null);
    const [error, setError] = React.useState(false);
    const [pending, setPending] = React.useState(initialPending);
    const [succeeded, setSucceeded] = React.useState(false);

    const refreshOnChange = () => {
        setPending(true);
        if (!keepDataOnRefresh) {
            setData(null);
        }
        setSucceeded(false);
        setError(false);

        callServer<T>(config)
            .then((axiosResponse) => {
                if (customSuccessProcessor) {
                    setData(customSuccessProcessor(axiosResponse));
                } else {
                    setData(axiosResponse.data as unknown as R);
                }
                setError(false);
                setSucceeded(true);
            })
            .catch((err) => {
                setError(true);
                setSucceeded(false);
                setData(null);
                if (onError) {
                    onError();
                }
            })
            .finally(() => setPending(false));
    };

    React.useEffect(() => {
        if (sendRequestOnDependencyChange) {
            refreshOnChange();
        }
    }, [...deps, sendRequestOnDependencyChange]);

    return {
        data: data,
        failed: error,
        pending: pending,
        succeeded: succeeded,
        reloadEndpoint: refreshOnChange,
    };
};

export default useEndpoint;
