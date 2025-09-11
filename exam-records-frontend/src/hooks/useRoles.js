import {useEffect, useState} from "react";
import roleRepository from "../repository/roleRepository.js";

const useRoles = () => {
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        roleRepository
            .findAll()
            .then((response) => {
                setRoles(response.data);
            })
            .catch((error) => {
                setRoles([]);
            });
    }, []);

    return roles;
};

export default useRoles;
