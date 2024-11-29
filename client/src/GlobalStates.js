import React from 'react';
import {useState, createContext} from 'react';

export const AuthContext = createContext();
export function AuthProvider (props) {
    const [authState, setAuthSate] = useState();
    return (
    <AuthContext.Provider value={[authState, setAuthSate]}>
    {props.children}
    </AuthContext.Provider>
    );
}