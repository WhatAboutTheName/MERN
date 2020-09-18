import { createContext } from 'react';

export const AuthContext = createContext({
    admin: false,
    token: null,
    userId: null,
    login: Object,
    logout: Object,
    isAuthenticatied: false
});