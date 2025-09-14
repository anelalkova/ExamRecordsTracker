import { useState, useEffect } from 'react';
import teacherRepository from '../repository/teacherRepository.js';

const useTeacherExams = (teacherId) => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTeacherExams = async () => {
        if (!teacherId) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await teacherRepository.getTeacherExams(teacherId);
            setExams(response.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch exams');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeacherExams();
    }, [teacherId]);

    return {
        exams,
        loading,
        error,
        refetch: fetchTeacherExams
    };
};

export default useTeacherExams;
