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
                console.log("Users API response:", response.data);
                setState({
                    "users": response.data,
                    "loading": false
                });
            })
            .catch((error) => console.log(error));
    }, []);

    return {...state, fetchUsersWithRole};
};

export default useUsers;
