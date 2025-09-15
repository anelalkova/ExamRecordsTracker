import {useState, useEffect, useCallback} from "react";
import examsRepository from "../repository/examsRepository.js";

const useExamsPaged = (subjectCode, page = 0, size = 5, user = null) => {
    const [examsPage, setExamsPage] = useState({content: [], totalElements: 0});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchExams = useCallback(async () => {
        setLoading(true);
        try {
            let response;
            if (user && user.roles && user.roles.includes("ROLE_STUDENT")) {
                response = await examsRepository.findAllPagedForStudent(subjectCode, user.userId, page, size);
            } else {
                response = await examsRepository.findAllPaged(subjectCode, page, size);
            }

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
    }, [subjectCode, page, size, user]);

    useEffect(() => {
        if (subjectCode) {
            fetchExams();
        }
    }, [fetchExams, subjectCode]);

    return {examsPage, loading, error, refetch: fetchExams};
};

export default useExamsPaged;
