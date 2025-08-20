import {useCallback, useEffect, useState} from "react";
import subjectRepository from "../repository/subjectRepository.js";

const initialState = {
    "subjects": [],
    "loading": true,
};

const useSubjects = () => {
    const [state, setState] = useState(initialState);

    const fetchSubjects = useCallback(() => {
        subjectRepository
            .findAll()
            .then((response) => {
                console.log("Subjects API response:", response.data);
                setState({
                    "subjects": response.data,
                    "loading": false
                });
            })
            .catch((error) => console.log(error));
    }, []);

    const onAdd = useCallback((data) => {
        subjectRepository
            .add(data)
            .then(() => {
                console.log("Successfully added a new product.");
                fetchSubjects();
            })
            .catch((error) => console.log(error));
    }, [fetchSubjects]);

    const onEdit = useCallback((id, data) => {
        subjectRepository
            .edit(id, data)
            .then(() => {
                console.log(`Successfully edited the subject with ID ${id}.`);
                fetchSubjects();
            })
            .catch((error) => console.log(error));
    }, [fetchSubjects]);

    useEffect(() => {
        fetchSubjects();
    }, [fetchSubjects]);


    return {...state, onAdd: onAdd, onEdit: onEdit};
};

export default useSubjects;
