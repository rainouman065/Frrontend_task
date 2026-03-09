import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 🔹 API ka base path
const base = 'https://api.escuelajs.co/api/v1';

// 🔹 Endpoints
export const endpoints = {
  products: base + '/products',
  product: (id) => base + '/products/' + id,
  productRelated: (id) => base + '/products/' + id + '/related',
  categories: base + '/categories',
  authLogin: base + '/auth/login',
  authProfile: base + '/auth/profile',
  authRefresh: base + '/auth/refresh-token',
  users: base + '/users',
  usersCheckEmail: base + '/users/is-available',
  filesUpload: base + '/files/upload',
  locations: base + '/locations',
};

// 🔹 Auth Token Helpers
export function getAuthHeaders() {
  const token = localStorage.getItem('access_token');
  if (token) return { Authorization: 'Bearer ' + token };
  return {};
}

export function setTokens(access, refresh) {
  if (access) localStorage.setItem('access_token', access);
  if (refresh) localStorage.setItem('refresh_token', refresh);
}

export function clearTokens() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}


const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.request.use(
  (config) => {
    if (!config.noAuth) {
      const token = localStorage.getItem('access_token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => (response.status === 204 ? null : response.data),
  (error) => {
    const msg = error.response?.data?.message || error.message || 'Request failed';
    const e = new Error(msg);
    e.status = error.response?.status;
    e.response = error.response;
    return Promise.reject(e);
  }
);

// signal method
export const api = {

  request: (type, url, data = null, options = {}) => {
    const config = { method: type, url, data, ...options };
    return apiClient.request(config);
  },
};


function toArrayKeys(keys) {
  if (!keys) return [];
  return Array.isArray(keys) ? keys : [keys];
}


export function useApiQuery({
  queryKey,
  method = 'get',
  url,
  data = null,
  requestOptions = {},
  ...queryOptions
}) {
  return useQuery({
    queryKey,
    queryFn: async () => api.request(method, url, data, requestOptions),
    ...queryOptions,
  });
}

// POST / PUT / DELETE etc
export function useApiMutation({
  method,
  url,
  body = null,
  requestOptions = {},
  invalidateKeys = [],
  ...mutationOptions
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => {
      const requestUrl = typeof url === 'function' ? url(variables) : url;

      let requestData;
      if (typeof body === 'function') {
        requestData = body(variables);
      } else {
        requestData = variables ?? body;
      }

      return api.request(method, requestUrl, requestData, requestOptions);
    },
    onSuccess: async (data, variables, context) => {
      const keys = toArrayKeys(invalidateKeys);
      if (keys.length) {
        await Promise.all(
          keys.map((key) => queryClient.invalidateQueries({ queryKey: key }))
        );
      }
      return mutationOptions.onSuccess?.(data, variables, context);
    },
    ...mutationOptions,
  });
}

export default apiClient;
