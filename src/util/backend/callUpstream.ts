import axios, {AxiosPromise, AxiosRequestConfig} from 'axios';
import {parseReceivedProblemRelayResponse} from '@/util/both/problemRelay/responseParser/HttpResponseParsers';
import ReceivedProblemRelayError from '@/util/both/problemRelay/error/ReceivedProblemRelayError';
import ApiCallerResponseCodeIsNotSuccessError, {SerializableHttpResponse} from '@/error/ApiCallerResponseCodeIsNotSuccessError';

const callUpstream = <ReturnType>(
    axiosRequestConfig: AxiosRequestConfig,
    isResponseStatusValid: (status: number) => boolean = (status: number) => status === 200,
    useJson = true,
): AxiosPromise<ReturnType> => {
    const calledEndpointText = `${axiosRequestConfig.method} ${axiosRequestConfig.baseURL}${axiosRequestConfig.url}`;

    if (useJson) {
        if (!axiosRequestConfig.headers) {
            axiosRequestConfig.headers = {}
        }
        axiosRequestConfig.headers['Content-type'] = 'application/json';
        axiosRequestConfig.headers['accept'] = 'application/json';
    }

    axiosRequestConfig.validateStatus = (status: number) => {
        return true; // Always returning true to handle all HTTP response codes and be able to extract the bodies
    };

    const axiosPromise: AxiosPromise<ReturnType> = axios(axiosRequestConfig);

    return axiosPromise
        .catch((err) => {
            //This catch clause is intentionally put before the then clause not to catch exceptions thrown there (there = then clause)
            console.error(`Error during API call in callUpstream to ${calledEndpointText}!`, err)
            throw new Error(`Error during API call in callUpstream to ${calledEndpointText}!`);
        })
        .then((response) => {
            if (isResponseStatusValid(response.status)) {
                return response;
            }

            const parsedReceivedProblem = parseReceivedProblemRelayResponse(response.status, response.headers, response.data);
            if (parsedReceivedProblem) {
                console.info(`Received a ProblemRelay in callUpstream when calling ${calledEndpointText} - ` + JSON.stringify(parsedReceivedProblem));
                throw new ReceivedProblemRelayError(parsedReceivedProblem);
            }


            const serializableResponse: SerializableHttpResponse = {
                status: response.status,
                headers: response.headers,
                body: response.data,
            };
            console.info(`Response code is not success in callUpstream when calling ${calledEndpointText}! ` + JSON.stringify(serializableResponse));
            throw new ApiCallerResponseCodeIsNotSuccessError('Response code is not success! ', axiosRequestConfig, serializableResponse);
        });
};

export default callUpstream;
