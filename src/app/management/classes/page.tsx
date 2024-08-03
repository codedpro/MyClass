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
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const classService = new UserService();
  const router = useRouter();

  useEffect(() => {
    const checkAuthorization = async () => {
      setTimeout(() => {
        const fetchedToken = classService.getToken();
        setToken(fetchedToken);
        if (fetchedToken) {
          setIsAuthorized(true);
          fetchClasses(fetchedToken);
          fetchUsers(fetchedToken);
        } else {
          setIsAuthorized(false);
        }
        setIsCheckingAuth(false);
      }, 3000); // 3-second delay
    };

    checkAuthorization();
  }, []);

  const fetchClasses = async (token: string) => {
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
        router.push("/");
        return;
      }
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error("Failed to fetch classes", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async (token: string) => {
    try {
      const response = await fetch("/api/users/d", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const handleSave = async (classData: Class) => {
    const method = classData._id ? "PUT" : "POST";
    const url = classData._id
      ? `/api/classes/${classData._id}`
      : "/api/classes/f";
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
        fetchClasses(token!);
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
        fetchClasses(token!);
      } else {
        console.error("Failed to delete class", await response.json());
      }
    } catch (error) {
      console.error("Failed to delete class", error);
    }
  };

  const handleEdit = (classData: Class) => {
    const schedule = classData.schedule || {};
    const dayChecks = {
      day1: !!schedule.day1,
      day2: !!schedule.day2,
      day3: !!schedule.day3,
      day4: !!schedule.day4,
      day5: !!schedule.day5,
      day6: !!schedule.day6,
      day7: !!schedule.day7,
    };

    const editableClass = {
      ...classData,
      dayChecks,
      times: {
        day1: schedule.day1 || "",
        day2: schedule.day2 || "",
        day3: schedule.day3 || "",
        day4: schedule.day4 || "",
        day5: schedule.day5 || "",
        day6: schedule.day6 || "",
        day7: schedule.day7 || "",
      },
    };

    setClassToEdit(editableClass as Class);
  };

  const handleCancel = () => {
    setClassToEdit(null);
    router.refresh();
  };

  if (isCheckingAuth) {
    return (
      <div>
        <DefaultLayout>
          <p className="text-bold text-center text-xl">
            Authorizing...
          </p>
        </DefaultLayout>
      </div>
    );
  }

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
