import React from "react";
import { Student } from "@/types/ClassActivity";
import StudentExercises from "./StudentExercises";

interface StudentListProps {
  students: Student[];
}

const StudentList: React.FC<StudentListProps> = ({ students }) => {
  return (
    <>
      <h2 className="text-xl font-semibold mt-4 mb-2">Students</h2>
      <ul className="list-disc pl-5">
        {students.map((student) => (
          <li key={student.studentId} className="mb-2">
            <p><strong>Student ID:</strong> {student.studentId}</p>
            <p><strong>Score:</strong> {student.score}</p>
            {student.comment && <p><strong>Comment:</strong> {student.comment}</p>}
            {student.exercises && student.exercises.length > 0 && (
              <StudentExercises exercises={student.exercises} />
            )}
          </li>
        ))}
      </ul>
    </>
  );
};

export default StudentList;
