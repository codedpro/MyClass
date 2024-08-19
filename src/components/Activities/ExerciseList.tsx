import React from "react";
import { ClassExercise } from "@/types/ClassActivity";

interface ExerciseListProps {
  exercises: ClassExercise[];
}

const ExerciseList: React.FC<ExerciseListProps> = ({ exercises }) => {
  return (
    <>
      <h2 className="text-xl font-semibold mt-4 mb-2">Class Exercises</h2>
      <ul className="list-disc pl-5">
        {exercises.map((exercise) => (
          <li key={exercise.exerciseID} className="mb-2">
            <p><strong>Title:</strong> {exercise.title}</p>
            <p><strong>Description:</strong> {exercise.description}</p>
            {exercise.attachedFilesUrl && (
              <p><strong>Files:</strong> <a href={exercise.attachedFilesUrl} className="text-blue-500 underline">View Files</a></p>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};

export default ExerciseList;
