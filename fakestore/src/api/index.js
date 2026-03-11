import axios from 'axios';

const API_BASE_URL = 'https://fakerestapi.azurewebsites.net/api/v1';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetchBooks = async () => {
    const response = await apiClient.get('/Books');
    return response.data;
};

export const createBook = async (book) => {
    const response = await apiClient.post('/Books', book);
    return response.data;
};

export const updateBook = async ({ id, book }) => {
    const response = await apiClient.put(`/Books/${id}`, book);
    return response.data;
};

export const deleteBook = async (id) => {
    const response = await apiClient.delete(`/Books/${id}`);
    return response.data;
};

export const fetchAuthors = async () => {
    const response = await apiClient.get('/Authors');
    return response.data;
};

export const createAuthor = async (author) => {
    const response = await apiClient.post('/Authors', author);
    return response.data;
};

export const updateAuthor = async ({ id, author }) => {
    const response = await apiClient.put(`/Authors/${id}`, author);
    return response.data;
};

export const deleteAuthor = async (id) => {
    const response = await apiClient.delete(`/Authors/${id}`);
    return response.data;
};

export const fetchUsers = async () => {
    const response = await apiClient.get('/Users');
    return response.data;
};

export const createUser = async (user) => {
    const response = await apiClient.post('/Users', user);
    return response.data;
};

export const updateUser = async ({ id, ...user }) => {
    const response = await apiClient.put(`/Users/${id}`, user);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await apiClient.delete(`/Users/${id}`);
    return response.data;
};

export const fetchActivities = async () => {
    const response = await apiClient.get('/Activities');
    return response.data;
};

export const fetchCoverPhotos = async () => {
    const response = await apiClient.get('/CoverPhotos');
    return response.data;
};

export default apiClient;
