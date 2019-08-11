import React, { createContext, useReducer } from "react";

const INITIAL_STATE = {
    token: null,
    userId: null
};

const authReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return {
                token: action.payload.token,
                userId: action.payload.userId
            };

        case "LOGOUT":
            return {
                token: null,
                userId: null
            };
        default:
            return state;
    }
};

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [authState, authDispatch] = useReducer(authReducer, INITIAL_STATE);

    return (
        <AuthContext.Provider
            value={{
                authState,
                authDispatch
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
