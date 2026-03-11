import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = 'https://fakerestapi.azurewebsites.net/api/v1';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const request = async ({ url, method = 'GET', data, params, headers }) => {
    const response = await apiClient.request({
        url,
        method,
        data,
        params,
        headers,
    });
    return response.data;
};

export const useCommonMutation = (url, type, options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload) => {
            const finalUrl = typeof url === 'function' ? url(payload) : url;
            const dataToPass = typeof payload === 'object' ? payload : null;

            return request({
                url: finalUrl,
                method: type,
                data: type === 'DELETE' ? undefined : dataToPass
            });
        },
        ...options,
        onSuccess: (data, variables, context) => {
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
