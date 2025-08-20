import {useState, useEffect} from "react";
import examsRepository from "../repository/examsRepository.js";

const useExamsPaged = (subjectCode, page = 0, size = 5) => {
    const [examsPage, setExamsPage] = useState({content: [], totalElements: 0});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExams = async () => {
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
        };

        if (subjectCode) {
            fetchExams();
        }
    }, [subjectCode, page, size]);

    return {examsPage, loading, error};
};

export default useExamsPaged;
