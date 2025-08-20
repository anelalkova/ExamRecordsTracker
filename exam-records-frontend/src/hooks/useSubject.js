import {useState, useEffect} from "react";
import subjectRepository from "../repository/subjectRepository.js";

const useSubject = (subjectCode) => {
    const [subject, setSubject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!subjectCode) return;

        setLoading(true);
        subjectRepository.findById(subjectCode)
            .then((response) => {
                setSubject(response.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching subject:", err);
                setError("Failed to load subject.");
                setLoading(false);
            });
    }, [subjectCode]);

    return {subject, loading, error};
};

export default useSubject;
