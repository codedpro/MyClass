"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import SwitcherThree from "../FormElements/Switchers/SwitcherThree";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Alert from "@/components/Alerts/Alert";
import { FiEdit } from "react-icons/fi";
import { Student, ClassExercise, ClassActivity } from "@/types/ClassActivity";

interface AdminViewProps {
  activity: ClassActivity;
}

const AdminView: React.FC<AdminViewProps> = ({ activity }) => {
  const [alertMessage, setAlertMessage] = useState<string>(
    activity.alert || ""
  );
  const [note, setNote] = useState<string>(activity.note || "");
  const [presentEnable, setPresentEnable] = useState<boolean>(
    activity.presentEnable || false
  );
  const [exercises, setExercises] = useState<ClassExercise[]>(
    activity.classExercises || []
  );
  const [newExercise, setNewExercise] = useState({
    title: "",
    description: "",
    attachedFiles: [] as File[],
  });
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentModalOpen, setStudentModalOpen] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "warning";
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleTogglePresentEnable = async () => {
    const updatedStatus = !presentEnable;
    setPresentEnable(updatedStatus);
    try {
      await axios.put(`/api/class/${activity._id}`, {
        presentEnable: updatedStatus,
      });
      setAlert({
        type: "success",
        title: "Success",
        message: "Present Enable status updated successfully.",
      });
    } catch (error) {
      console.error("Error updating presentEnable status:", error);
      setAlert({
        type: "error",
        title: "Error",
        message: "Failed to update Present Enable status.",
      });
    }
  };

  const handleSaveAlert = async () => {
    if (!alertMessage.trim()) {
      setAlert({
        type: "warning",
        title: "Warning",
        message: "Alert message cannot be empty.",
      });
      return;
    }
    try {
      await axios.put(`/api/class/${activity._id}`, { alert: alertMessage });
      setAlert({
        type: "success",
        title: "Success",
        message: "Alert message saved successfully.",
      });
    } catch (error) {
      console.error("Error saving alert:", error);
      setAlert({
        type: "error",
        title: "Error",
        message: "Failed to save alert message.",
      });
    }
  };

  const handleSaveNote = async () => {
    if (!note.trim()) {
      setAlert({
        type: "warning",
        title: "Warning",
        message: "Note cannot be empty.",
      });
      return;
    }
    try {
      await axios.put(`/api/class/${activity._id}`, { note });
      setAlert({
        type: "success",
        title: "Success",
        message: "Note saved successfully.",
      });
    } catch (error) {
      console.error("Error saving note:", error);
      setAlert({
        type: "error",
        title: "Error",
        message: "Failed to save note.",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const validFiles = files.filter((file) => file.size <= 8 * 1024 * 1024);
    if (validFiles.length < files.length) {
      setAlert({
        type: "warning",
        title: "Warning",
        message:
          "Some files were too large and were not added. Max size is 8MB.",
      });
    }
    setNewExercise((prev) => ({ ...prev, attachedFiles: validFiles }));
  };

  const handleAddExercise = async () => {
    if (!newExercise.title.trim() || !newExercise.description.trim()) {
      setAlert({
        type: "warning",
        title: "Warning",
        message: "Title and Description are required.",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    const uploadedFilesUrls: string[] = [];

    try {
      if (newExercise.attachedFiles.length > 0) {
        const formData = new FormData();
        newExercise.attachedFiles.forEach((file) =>
          formData.append("files", file)
        );

        const response = await axios.post(`/api/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(progress);
            }
          },
        });
        uploadedFilesUrls.push(...response.data.urls);
      }

      const newExerciseWithId = {
        ...newExercise,
        attachedFilesUrl: uploadedFilesUrls.join(", "),
        exerciseID: Date.now().toString(),
      };

      const updatedExercises = [...exercises, newExerciseWithId];

      await axios.put(`/api/class/${activity._id}`, {
        classExercises: updatedExercises,
      });

      setExercises(updatedExercises);
      setNewExercise({ title: "", description: "", attachedFiles: [] });
      setAlert({
        type: "success",
        title: "Success",
        message: "Exercise added successfully.",
      });
    } catch (error) {
      console.error("Error adding exercise:", error);
      setAlert({
        type: "error",
        title: "Error",
        message: "Failed to add exercise.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFinishClass = async () => {
    try {
      await axios.post(`/api/class/${activity._id}/finish`);
      setAlert({
        type: "success",
        title: "Success",
        message: "Class finished successfully.",
      });
    } catch (error) {
      console.error("Error finishing class:", error);
      setAlert({
        type: "error",
        title: "Error",
        message: "Failed to finish class.",
      });
    }
  };

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setStudentModalOpen(true);
  };

  const handleSaveStudentData = async () => {
    if (!selectedStudent) return;

    const updatedStudents = activity.students?.map((student: Student) =>
      student.studentId === selectedStudent.studentId
        ? selectedStudent
        : student
    );

    try {
      await axios.put(`/api/class/${activity._id}`, {
        students: updatedStudents,
      });
      setStudentModalOpen(false);
      setAlert({
        type: "success",
        title: "Success",
        message: "Student data saved successfully.",
      });
    } catch (error) {
      console.error("Error saving student data:", error);
      setAlert({
        type: "error",
        title: "Error",
        message: "Failed to save student data.",
      });
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Class Management" />

      {alert && (
        <Alert type={alert.type} title={alert.title} message={alert.message} />
      )}

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        {/* Class Settings Section */}
        <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-dark dark:text-white">
              Class Settings
            </h2>
            <button
              onClick={handleFinishClass}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Finish Class
            </button>
          </div>
          <div className="mt-4">
            <label className="block text-dark dark:text-white">
              Present Enable
            </label>
            <SwitcherThree
              enabled={presentEnable}
              onToggle={handleTogglePresentEnable}
            />
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="flex-1 mr-4">
              <label className="block text-dark dark:text-white">Alert</label>
              <input
                type="text"
                value={alertMessage}
                onChange={(e) => setAlertMessage(e.target.value)}
                className="mt-2 w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>
            <button
              onClick={handleSaveAlert}
              className="mt-2 bg-primary text-white px-4 py-2 rounded"
            >
              Save Alert
            </button>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="flex-1 mr-4">
              <label className="block text-dark dark:text-white">Note</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-2 w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>
            <button
              onClick={handleSaveNote}
              className="mt-2 bg-primary text-white px-4 py-2 rounded"
            >
              Save Note
            </button>
          </div>
        </div>

        {/* Class Exercises Section */}
        <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card p-6">
          <h2 className="text-lg font-medium text-dark dark:text-white">
            Class Exercises
          </h2>
          <div className="mt-4 space-y-4">
            {exercises.map((exercise, index) => (
              <div
                key={index}
                className="p-4 bg-gray-100 dark:bg-dark-2 rounded"
              >
                <h4 className="font-medium text-dark dark:text-white">
                  {exercise.title}
                </h4>
                <p className="text-dark dark:text-white">
                  {exercise.description}
                </p>
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
              </div>
            ))}
          </div>
          <div className="mt-4">
            <h3 className="text-md font-medium text-dark dark:text-white">
              Add New Exercise
            </h3>
            <input
              type="text"
              placeholder="Title"
              value={newExercise.title}
              onChange={(e) =>
                setNewExercise({ ...newExercise, title: e.target.value })
              }
              className="mt-2 w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            />
            <input
              type="text"
              placeholder="Description"
              value={newExercise.description}
              onChange={(e) =>
                setNewExercise({ ...newExercise, description: e.target.value })
              }
              className="mt-2 w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            />
            <div className="mt-4">
              <label className="block text-dark dark:text-white">
                Attachments
              </label>
              <label className="mt-2 flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary-600">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.zip,.rar"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                Choose Files
              </label>
              {isUploading && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-center mt-2 text-sm text-dark dark:text-white">
                    {uploadProgress}% uploaded
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={handleAddExercise}
              disabled={
                isUploading ||
                !newExercise.title.trim() ||
                !newExercise.description.trim()
              }
              className={`mt-4 bg-primary text-white px-4 py-2 rounded ${
                isUploading ||
                !newExercise.title.trim() ||
                !newExercise.description.trim()
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isUploading ? "Uploading..." : "Add Exercise"}
            </button>
          </div>
        </div>

        {/* Students Section */}
        <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card p-6">
          <h2 className="text-lg font-medium text-dark dark:text-white">
            Students
          </h2>
          <div className="mt-4 space-y-4">
            {activity.students?.map((student: Student) => (
              <div
                key={student.studentId}
                className="p-4 bg-gray-100 dark:bg-dark-2 rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-dark dark:text-white">
                    {student.studentId}
                  </p>
                  <p className="text-dark dark:text-white">
                    Score: {student.score}
                  </p>
                  {student.comment && (
                    <p className="text-dark dark:text-white">
                      Comment: {student.comment}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleStudentClick(student)}
                  className="bg-primary hover:bg-primary-600 text-white p-2 rounded"
                >
                  <FiEdit size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student Modal */}
      {studentModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-dark p-6 rounded shadow-md">
            <h3 className="text-lg font-medium text-dark dark:text-white">
              Edit Student
            </h3>
            <div className="mt-4">
              <label className="block text-dark dark:text-white">Score</label>
              <input
                type="number"
                value={selectedStudent.score}
                onChange={(e) =>
                  setSelectedStudent((prev) =>
                    prev ? { ...prev, score: Number(e.target.value) } : null
                  )
                }
                className="mt-2 w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="mt-4">
              <label className="block text-dark dark:text-white">Comment</label>
              <textarea
                value={selectedStudent.comment || ""}
                onChange={(e) =>
                  setSelectedStudent((prev) =>
                    prev ? { ...prev, comment: e.target.value } : null
                  )
                }
                className="mt-2 w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="mt-4">
              <label className="block text-dark dark:text-white">
                Exercises
              </label>
              {selectedStudent.exercises?.map((exercise, index) => (
                <div
                  key={index}
                  className="mt-2 p-2 bg-gray-100 dark:bg-dark-2 rounded"
                >
                  <h4 className="font-medium text-dark dark:text-white">
                    {exercise.exerciseID}
                  </h4>
                  <p className="text-dark dark:text-white">{exercise.answer}</p>
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
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setStudentModalOpen(false)}
                className="rounded bg-gray-200 px-4 py-2 text-dark hover:bg-gray-300 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStudentData}
                className="rounded bg-primary text-white px-4 py-2"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};

export default AdminView;
