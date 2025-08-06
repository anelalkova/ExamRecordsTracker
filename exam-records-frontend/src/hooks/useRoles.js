import {useEffect, useState} from "react";
import roleRepository from "../repository/roleRepository.js";

const useRoles = () => {
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        roleRepository
            .findAll()
            .then((response) => {
                console.log("Roles API response:", response.data);
                setRoles(response.data);
            })
            .catch((error) => console.log(error));
    }, []);

    return roles;
};

export default useRoles;
