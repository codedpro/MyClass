import React from "react";
import { Exercise } from "@/types/ClassActivity";

interface StudentExercisesProps {
  exercises: Exercise[];
}

const StudentExercises: React.FC<StudentExercisesProps> = ({ exercises }) => {
  return (
    <>
      <h3 className="text-lg font-semibold mt-2 mb-1">Exercises</h3>
      <ul className="list-disc pl-5">
        {exercises.map((ex) => (
          <li key={ex.exerciseID} className="mb-2">
            <p><strong>Exercise ID:</strong> {ex.exerciseID}</p>
            <p><strong>Answer:</strong> {ex.answer}</p>
            {ex.attachedFilesUrl && (
              <p><strong>Files:</strong> <a href={ex.attachedFilesUrl} className="text-blue-500 underline">View Files</a></p>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};

export default StudentExercises;
