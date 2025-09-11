import {useState, useEffect, useCallback} from "react";
import examsRepository from "../repository/examsRepository.js";

const useExamsPaged = (subjectCode, page = 0, size = 5) => {
    const [examsPage, setExamsPage] = useState({content: [], totalElements: 0});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchExams = useCallback(async () => {
        setLoading(true);
        try {
            const response = await examsRepository.findAllPaged(subjectCode, page, size);

            setExamsPage({
                content: response.data.content,
                totalElements: response.data.totalElements
            });
        } catch (err) {
            console.error("Error fetching exams:", err);
            setError("Failed to load exams.");
        } finally {
            setLoading(false);
        }
    }, [subjectCode, page, size]);

    useEffect(() => {
        if (subjectCode) {
            fetchExams();
        }
    }, [fetchExams, subjectCode]);

    return {examsPage, loading, error, refetch: fetchExams};
};

export default useExamsPaged;
