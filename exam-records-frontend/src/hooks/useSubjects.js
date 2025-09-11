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
                setState({
                    "subjects": response.data,
                    "loading": false
                });
            })
            .catch((error) => {
                setState({
                    "subjects": [],
                    "loading": false
                });
            });
    }, []);

    const onAdd = useCallback((data) => {
        subjectRepository
            .add(data)
            .then(() => {
                fetchSubjects();
            })
            .catch((error) => {
                setState({
                    "subjects": [],
                    "loading": false
                });
            });
    }, [fetchSubjects]);

    const onEdit = useCallback((id, data) => {
        subjectRepository
            .edit(id, data)
            .then(() => {
                fetchSubjects();
            })
            .catch((error) => {
                setState({
                    "subjects": [],
                    "loading": false
                });
            });
    }, [fetchSubjects]);

    useEffect(() => {
        fetchSubjects();
    }, [fetchSubjects]);


    return {...state, onAdd: onAdd, onEdit: onEdit};
};

export default useSubjects;
