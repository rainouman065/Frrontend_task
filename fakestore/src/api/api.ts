import axios, { Method } from 'axios';
import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';

const API_BASE_URL = 'https://fakerestapi.azurewebsites.net/api/v1';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

interface RequestArgs {
    url: string;
    method?: Method;
    data?: any;
    params?: any;
    headers?: any;
}

export const request = async ({ url, method = 'GET', data, params, headers }: RequestArgs) => {
    const response = await apiClient.request({
        url,
        method,
        data,
        params,
        headers,
    });
    return response.data;
};

interface CommonMutationOptions<TData, TVariables, TContext> 
    extends Omit<UseMutationOptions<TData, Error, TVariables, TContext>, 'mutationFn'> {
    queryKeyToInvalidate?: any[];
}

export const useCommonMutation = <TData = any, TVariables = any, TContext = unknown>(
    url: string | ((payload: TVariables) => string),
    type: Method,
    options: CommonMutationOptions<TData, TVariables, TContext> = {}
) => {
    const queryClient = useQueryClient();

    return useMutation<TData, Error, TVariables, TContext>({
        mutationFn: async (payload: TVariables) => {
            const finalUrl = typeof url === 'function' ? url(payload) : url;
            const dataToPass = typeof payload === 'object' ? payload : null;

            return request({
                url: finalUrl,
                method: type,
                data: type === 'DELETE' ? undefined : dataToPass
            });
        },
        ...options,
        onSuccess: (data: TData, variables: TVariables, context: TContext) => {
            if (options.onSuccess) {
                options.onSuccess(data, variables, context);
            }
            if (options.queryKeyToInvalidate) {
                queryClient.invalidateQueries({ queryKey: options.queryKeyToInvalidate });
            }
        }
    });
};

export default apiClient;
