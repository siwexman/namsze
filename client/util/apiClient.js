import axios from 'axios';

export const apiClient = axios.create({
    baseURL: 'http://172.19.112.227:3000/api/v1',
    timeout: 10 * 1000,
    headers: {
        'Content-Type': 'applicaton/json',
        Accept: 'application/json',
    },
});
