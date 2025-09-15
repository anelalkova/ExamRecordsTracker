import {useState, useEffect} from "react";
import subjectRepository from "../repository/subjectRepository.js";

const useSubjectsPaged = (userEmail, roles, page = 0, size = 5) => {
    const [subjectsPage, setSubjectsPage] = useState({content: [], totalElements: 0});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSubjects = async () => {
            setLoading(true);
            try {
                let response;
                if (roles.includes("ROLE_STUDENT")) {
                    response = await subjectRepository.findAllForUserPaged(userEmail, page, size);
                } else if (roles.includes("ROLE_TEACHER")) {
                    response = await subjectRepository.findAllForTeacherPaged(userEmail, page, size);
                } else {
                    response = await subjectRepository.findAllPaged(page, size);
                }

                setSubjectsPage({
                    content: response.data.content,
                    totalElements: response.data.totalElements
                });
            } catch (err) {
                console.error("Error fetching subjects:", err);
                setError("Failed to load subjects.");
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
    }, [userEmail, roles, page, size]);

    return {subjectsPage, loading, error};
};

export default useSubjectsPaged;
