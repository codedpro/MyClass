"use client";
import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import UserForm from "@/components/usermanagement/userform";
import { User } from "@/types/User";
import { UserService } from "@/services/userService";
import { useRouter } from "next/navigation";
import UserList from "@/components/usermanagement/userlist";
import Cookies from "js-cookie";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [token, setToken] = useState<string | undefined>(Cookies.get("token"));
  const userservice = new UserService();

  useEffect(() => {
    if (!isAuthorized) {
      setToken(userservice.getToken());
    }

    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/users/a", {
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
      console.log(data);
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (user: User) => {
    const method = user._id ? "PUT" : "POST";
    const url = user._id ? `/api/users/${user._id}` : "/api/users/a";
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });
      if (response.ok) {
        fetchUsers();
        setUserToEdit(null);
      } else {
        console.error("Failed to save user", await response.json());
      }
    } catch (error) {
      console.error("Failed to save user", error);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        fetchUsers();
      } else {
        console.error("Failed to delete user", await response.json());
      }
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  const handleEdit = (user: User) => {
    setUserToEdit(user);
  };
  const router = useRouter();
  const handleCancel = () => {
    setUserToEdit(null);
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
        <Breadcrumb pageName="User-Management" />
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
          <div className="flex flex-col gap-9">
            <UserForm
              user={userToEdit}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
          <div className="flex flex-col gap-9">
            {isLoading ? (
              <p>Loading users...</p>
            ) : (
              <>
                {users ? (
                  <UserList
                    users={users}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                  />
                ) : (
                  <></>
                )}
              </>
            )}
          </div>
        </div>
      </DefaultLayout>
    </div>
  );
}
