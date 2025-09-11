import React, {useEffect, useState} from 'react';
import AuthContext from "../contexts/authContext.js";

const decode = (jwtToken) => {
    try {
        return JSON.parse(atob(jwtToken.split(".")[1]));
    } catch (error) {
        return null;
    }
};

const AuthProvider = ({children}) => {
    const [state, setState] = useState({
        "user": null,
        "loading": true,
        "requiresPasswordChange": false
    });

    const login = (loginResponse) => {
        let jwtToken, requiresPasswordChange = false;
        
        if (typeof loginResponse === 'string') {
            jwtToken = loginResponse;
        } else {
            jwtToken = loginResponse.token;
            requiresPasswordChange = loginResponse.requiresPasswordChange || false;
        }
        
        const payload = decode(jwtToken);
        if (payload) {
            localStorage.setItem("token", jwtToken);
            localStorage.setItem("requiresPasswordChange", requiresPasswordChange.toString());
            setState({
                "user": payload,
                "loading": false,
                "requiresPasswordChange": requiresPasswordChange
            });
        }
    };

    const logout = () => {
        const jwtToken = localStorage.getItem("token");
        if (jwtToken) {
            localStorage.removeItem("token");
            localStorage.removeItem("requiresPasswordChange");
            setState({
                "user": null,
                "loading": false,
                "requiresPasswordChange": false
            });
        }
    };

    const markPasswordChanged = () => {
        localStorage.removeItem("requiresPasswordChange");
        setState(prev => ({
            ...prev,
            "requiresPasswordChange": false
        }));
    };

    useEffect(() => {
        const jwtToken = localStorage.getItem("token");
        const requiresPasswordChange = localStorage.getItem("requiresPasswordChange") === 'true';
        
        if (jwtToken) {
            const payload = decode(jwtToken);
            if (payload) {
                setState({
                    "user": payload,
                    "loading": false,
                    "requiresPasswordChange": requiresPasswordChange
                });
            } else {
                setState({
                    "user": null,
                    "loading": false,
                    "requiresPasswordChange": false
                });
            }
        } else {
            setState({
                "user": null,
                "loading": false,
                "requiresPasswordChange": false
            });
        }
    }, []);

    return (
        <AuthContext.Provider value={{login, logout, markPasswordChanged, ...state, isLoggedIn: !!state.user}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;