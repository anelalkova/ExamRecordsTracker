import { useState, useEffect } from 'react';
import teacherRepository from '../repository/teacherRepository.js';

const useStudentGrading = (examId, teacherId) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchStudents = async () => {
        if (!examId || !teacherId) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await teacherRepository.getStudentsForGrading(examId, teacherId);
            setStudents(response.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch students');
        } finally {
            setLoading(false);
        }
    };

    const assignGrade = async (studentId, grade) => {
        try {
            const response = await teacherRepository.assignGrade(examId, studentId, grade, teacherId);
            
            setStudents(prevStudents => 
                prevStudents.map(student => 
                    student.studentId === studentId 
                        ? { ...student, grade: response.data.grade, gradedAt: response.data.gradedAt, gradedByName: response.data.gradedByName }
                        : student
                )
            );
            
            return response.data;
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Failed to assign grade');
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [examId, teacherId]);

    return {
        students,
        loading,
        error,
        assignGrade,
        refetch: fetchStudents
    };
};

export default useStudentGrading;
