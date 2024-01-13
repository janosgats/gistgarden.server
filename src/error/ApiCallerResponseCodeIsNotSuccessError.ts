import {AxiosRequestConfig} from 'axios';

export interface SerializableHttpResponse {
    status: number;
    headers: Record<string, any>;
    body: any;
}

export default class ApiCallerResponseCodeIsNotSuccessError extends Error {
    public requestConfig: AxiosRequestConfig;
    public response: SerializableHttpResponse;

    constructor(
        message: string,
        requestConfig: AxiosRequestConfig,
        response: SerializableHttpResponse,
    ) {
        super(message);
        this.requestConfig = requestConfig;
        this.response = response;
    }
}
