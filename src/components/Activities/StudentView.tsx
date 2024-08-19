"use client"
import React, { useState } from "react";
import axios from "axios";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { Exercise, ClassExercise, ClassActivity, Student } from "@/types/ClassActivity";

interface StudentViewProps {
  activity: ClassActivity;
}

const StudentView: React.FC<StudentViewProps> = ({ activity }) => {
  const [completedExercises, setCompletedExercises] = useState<Exercise[]>([]);
  const student = activity.students?.[0]; // Assuming there's only one student in this context

  if (!student) {
    return (
      <div className="text-red-500">
        Student not found.
      </div>
    );
  }

  const handleAddCompletedExercise = async (exerciseID: string) => {
    const existingExercise = completedExercises.find((ex) => ex.exerciseID === exerciseID);

    if (!existingExercise) {
      const newCompletedExercise = {
        exerciseID,
        answer: "",
        attachedFilesUrl: "",
      };
      setCompletedExercises([...completedExercises, newCompletedExercise]);
    }
  };

  const handleAnswerChange = (exerciseID: string, value: string) => {
    setCompletedExercises((prevExercises) =>
      prevExercises.map((ex) =>
        ex.exerciseID === exerciseID ? { ...ex, answer: value } : ex
      )
    );
  };

  const handleFileChange = (exerciseID: string, fileUrl: string) => {
    setCompletedExercises((prevExercises) =>
      prevExercises.map((ex) =>
        ex.exerciseID === exerciseID ? { ...ex, attachedFilesUrl: fileUrl } : ex
      )
    );
  };

  const handleSubmitExercises = async () => {
    try {
      const updatedStudent = {
        ...student,
        exercises: [...(student.exercises || []), ...completedExercises],
      };

      await axios.put(`/api/class/${activity._id}/student/${student.studentId}/exercises`, {
        exercises: updatedStudent.exercises,
      });

      setCompletedExercises([]);
      alert("Exercises submitted successfully!");
    } catch (error) {
      console.error("Error submitting exercises:", error);
      alert("Failed to submit exercises. Please try again.");
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Class Exercises" />

      <div className="space-y-6">
        <div className="bg-white p-6 rounded shadow-md dark:bg-gray-dark">
          <h2 className="text-lg font-medium text-dark dark:text-white">
            Your Current Score
          </h2>
          <p className="mt-4 text-dark dark:text-white">
            Score: {student.score}
          </p>
          {student.comment && (
            <p className="mt-2 text-dark dark:text-white">
              Comment: {student.comment}
            </p>
          )}
        </div>

        <div className="bg-white p-6 rounded shadow-md dark:bg-gray-dark">
          <h2 className="text-lg font-medium text-dark dark:text-white">Class Exercises</h2>
          <div className="mt-4 space-y-4">
            {activity.classExercises?.map((exercise) => (
              <div key={exercise.exerciseID} className="p-4 bg-gray-100 dark:bg-dark-2 rounded">
                <h4 className="font-medium text-dark dark:text-white">
                  {exercise.title}
                </h4>
                <p className="text-dark dark:text-white">{exercise.description}</p>
                {exercise.attachedFilesUrl && (
                  <a
                    href={exercise.attachedFilesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 dark:text-blue-400"
                  >
                    View Attached File
                  </a>
                )}
                <div className="mt-4">
                  <button
                    onClick={() => handleAddCompletedExercise(exercise.exerciseID)}
                    className="bg-primary text-white px-4 py-2 rounded"
                  >
                    Submit Answer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {completedExercises.length > 0 && (
          <div className="bg-white p-6 rounded shadow-md dark:bg-gray-dark">
            <h2 className="text-lg font-medium text-dark dark:text-white">Your Submissions</h2>
            {completedExercises.map((exercise) => (
              <div key={exercise.exerciseID} className="mt-4">
                <h4 className="font-medium text-dark dark:text-white">
                  Exercise {exercise.exerciseID}
                </h4>
                <textarea
                  value={exercise.answer}
                  onChange={(e) => handleAnswerChange(exercise.exerciseID, e.target.value)}
                  placeholder="Your answer"
                  className="mt-2 w-full rounded border px-4 py-2 text-dark dark:text-white"
                />
                <input
                  type="text"
                  value={exercise.attachedFilesUrl}
                  onChange={(e) => handleFileChange(exercise.exerciseID, e.target.value)}
                  placeholder="Attached File URL (optional)"
                  className="mt-2 w-full rounded border px-4 py-2 text-dark dark:text-white"
                />
              </div>
            ))}
            <button
              onClick={handleSubmitExercises}
              className="mt-4 bg-primary text-white px-4 py-2 rounded"
            >
              Submit All Exercises
            </button>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default StudentView;
