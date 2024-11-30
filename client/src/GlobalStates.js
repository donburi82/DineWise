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

export const GeoContext = createContext();
export function GeoProvider (props) {
     //set default as New York
    const [geolocation, setGeolocation] = useState({longitude: -73.93,latitude: 40.73});
    return (
        <GeoContext.Provider value={[geolocation, setGeolocation]}>
        {props.children}
        </GeoContext.Provider>
        );
}