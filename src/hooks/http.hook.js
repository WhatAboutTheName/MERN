import { useState, useCallback } from 'react';
import axios from 'axios';

export const Http = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const request = useCallback(async (url, method = 'get', body = null, header = {}) => {
        setLoading(true);
        try {
            let response = {};
            if (header.hasOwnProperty('Authorization')) {
                axios.defaults.headers.common['Authorization'] = header.Authorization;
                response = await axios[method](url, body);
            }else {
                response = await axios[method](url, body, {headers: header});
            }
            if (!response.statusText) {
                throw new Error(response.message || 'Oops! Something went wrong.');
            }
            setLoading(false);
            return response;
        } catch(e) {
            setLoading(false);
            setError(e.message);
            throw e;
        }
    }, [])

    const cleanError = useCallback(() => setError(null), []);

    const errorHandler = () => {
        if(error) {
            console.error(error);
            cleanError();
        }
    }
    return { loading, request, errorHandler, error, cleanError };
}
