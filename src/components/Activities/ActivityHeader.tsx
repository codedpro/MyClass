"use client"
import React, { useState, useEffect } from "react";
import { ClassActivity } from "@/types/ClassActivity";
import { UserService } from "@/services/userService";
import MarkPresentModal from "./MarkPresentModal";

interface ActivityHeaderProps {
  activity: ClassActivity;
}

const ActivityHeader: React.FC<ActivityHeaderProps> = ({ activity }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userservice = new UserService();
  const StudentId = userservice.getStudentNumber();

  useEffect(() => {
    if (activity.presentEnable && !activity.students?.some(student => student.studentId === StudentId)) {
      setIsModalOpen(true);
    }
  }, [activity.presentEnable, activity.students, StudentId]);

  const handleConfirm = async () => {
    try {
      const response = await fetch("/api/markPresent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ classId: activity._id, studentId: StudentId }),
      });

      if (response.ok) {
        setIsModalOpen(false);
      } else {
        throw new Error("Failed to mark as present");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    // Logic to exit the activity (e.g., navigate away)
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Class Activity Details</h1>
      <p><strong>Class ID:</strong> {activity.classId}</p>
      <p><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</p>

      {activity.alert && (
        <p><strong>Alert:</strong> {activity.alert}</p>
      )}

      {activity.note && (
        <p><strong>Note:</strong> {activity.note}</p>
      )}

      {activity.presentEnable !== undefined && (
        <p><strong>Present Enabled:</strong> {activity.presentEnable ? "Yes" : "No"}</p>
      )}

      <MarkPresentModal
        isOpen={isModalOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default ActivityHeader;
