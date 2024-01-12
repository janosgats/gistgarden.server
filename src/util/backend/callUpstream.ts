import axios, {AxiosPromise, AxiosRequestConfig} from 'axios';

const callUpstream = <ReturnType>(
    axiosRequestConfig: AxiosRequestConfig,
    isResponseStatusValid: (status: number) => boolean = (status: number) => status === 200,
    useJson = true,
): AxiosPromise<ReturnType> => {
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
            throw err;
        })
        .then((response) => {
            if (isResponseStatusValid(response.status)) {
                return response;
            }

            throw Error('TODO: throw proper error to handle them and stuff. ' + JSON.stringify(response.data));
        });
};

export default callUpstream;
