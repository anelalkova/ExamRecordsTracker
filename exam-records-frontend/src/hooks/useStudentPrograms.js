import { useState, useEffect } from "react";
import studentProgramsRepository from "../repository/studentProgramsRepository.js";

const useStudentPrograms = () => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        studentProgramsRepository
            .findAll()
            .then((response) => {
                setPrograms(response.data);
            })
            .catch((err) => {
                console.error("Error fetching student programs:", err);
                setError(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return { programs, loading, error };
};

export default useStudentPrograms;
