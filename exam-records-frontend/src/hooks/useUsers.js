import {useCallback, useState} from "react";
import userRepository from "../repository/userRepository.js";

const initialState = {
    "users": [],
    "loading": true,
};

const useUsers = () => {
    const [state, setState] = useState(initialState);

    const fetchUsersWithRole = useCallback((role) => {
        userRepository
            .findByRole(role)
            .then((response) => {
                setState({
                    "users": response.data,
                    "loading": false
                });
            })
            .catch((error) => {
                setState({
                    "users": [],
                    "loading": false
                });
            });
    }, []);

    return {...state, fetchUsersWithRole};
};

export default useUsers;
