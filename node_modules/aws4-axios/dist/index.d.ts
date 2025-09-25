import { aws4Interceptor, Credentials, InterceptorOptions } from "./interceptor";
import { CredentialsProvider } from "./credentials/credentialsProvider";
import { getAuthErrorMessage } from "./getAuthErrorMessage";
/**
 * @deprecated Please use the alternative export of `aws4Interceptor`
 */
export declare const interceptor: (options?: InterceptorOptions | undefined, credentials?: CredentialsProvider | Credentials | undefined) => (config: import("axios").AxiosRequestConfig<any>) => Promise<import("axios").AxiosRequestConfig<any>>;
export default aws4Interceptor;
export { getAuthErrorMessage, aws4Interceptor, Credentials, CredentialsProvider, InterceptorOptions, };
