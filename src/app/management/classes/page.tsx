"use client";
import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import ClassForm from "@/components/classmanagement/classform";
import { Class } from "@/types/Class";
import { UserService } from "@/services/userService";
import { useRouter } from "next/navigation";
import ClassList from "@/components/classmanagement/classlist";
import { User } from "@/types/User";
import Cookies from "js-cookie";

export default function ClassManagement() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [classToEdit, setClassToEdit] = useState<Class | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [token, setToken] = useState<string | undefined>(Cookies.get("token"));
  const classService = new UserService();

  const router = useRouter();

  useEffect(() => {
    if (!isAuthorized) {
      setToken(classService.getToken());
    }

    fetchClasses();
    fetchUsers();
  }, []);

  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/classes/x", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 403) {
        setIsAuthorized(false);
        router.push("/login");
        return;
      }
      setIsAuthorized(true);
      const data = await response.json();
      console.log(data)
      setClasses(data);
    } catch (error) {
      console.error("Failed to fetch classes", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users/d", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data)
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const handleSave = async (classData: Class) => {
    const method = classData._id ? "PUT" : "POST";
    const url = classData._id ? `/api/classes/${classData._id}` : "/api/classes/f";
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(classData),
      });
      if (response.ok) {
        fetchClasses();
        setClassToEdit(null);
      } else {
        console.error("Failed to save class", await response.json());
      }
    } catch (error) {
      console.error("Failed to save class", error);
    }
  };

  const handleDelete = async (classId: string) => {
    try {
      const response = await fetch(`/api/classes/${classId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        fetchClasses();
      } else {
        console.error("Failed to delete class", await response.json());
      }
    } catch (error) {
      console.error("Failed to delete class", error);
    }
  };

  const handleEdit = (classData: Class) => {
    const transformedClassData = {
      ...classData,
      dayChecks: {
        day1: Boolean(classData.schedule.day1),
        day2: Boolean(classData.schedule.day2),
        day3: Boolean(classData.schedule.day3),
        day4: Boolean(classData.schedule.day4),
        day5: Boolean(classData.schedule.day5),
        day6: Boolean(classData.schedule.day6),
        day7: Boolean(classData.schedule.day7),
      },
      times: {
        day1: classData.schedule.day1 || '',
        day2: classData.schedule.day2 || '',
        day3: classData.schedule.day3 || '',
        day4: classData.schedule.day4 || '',
        day5: classData.schedule.day5 || '',
        day6: classData.schedule.day6 || '',
        day7: classData.schedule.day7 || '',
      }
    };
  
    setClassToEdit(classData);
  };

  const handleCancel = () => {
    setClassToEdit(null);
    router.refresh();
  };

  if (!isAuthorized) {
    return (
      <div>
        <DefaultLayout>
          <p className="text-bold text-center text-xl">
            You are not authorized to view this page.
          </p>
        </DefaultLayout>
      </div>
    );
  }

  return (
    <div>
      <DefaultLayout>
        <Breadcrumb pageName="Class-Management" />
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
          <div className="flex flex-col gap-9">
            <ClassForm
              classData={classToEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              users={users}
            />
          </div>
          <div className="flex flex-col gap-9">
            {isLoading ? (
              <p>Loading classes...</p>
            ) : (
              <>
                {classes.length > 0 ? (
                  <ClassList
                    classes={classes}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                  />
                ) : (
                  <p>No classes found.</p>
                )}
              </>
            )}
          </div>
        </div>
      </DefaultLayout>
    </div>
  );
}
