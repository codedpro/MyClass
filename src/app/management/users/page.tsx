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
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);
  const userService = new UserService();
  const router = useRouter();

  useEffect(() => {
    const checkAuthorization = async () => {
      setTimeout(() => {
        const fetchedToken = userService.getToken();
        setToken(fetchedToken);
        if (fetchedToken) {
          setIsAuthorized(true);
          fetchUsers(fetchedToken);
        } else {
          setIsAuthorized(false);
        }
        setIsCheckingAuth(false);
      }, 3000); // 3-second delay
    };

    checkAuthorization();
  }, []);

  const fetchUsers = async (token: string) => {
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
        router.push("/");
        return;
      }
      const data = await response.json();
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
        fetchUsers(token!);
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
        fetchUsers(token!);
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

  const handleCancel = () => {
    setUserToEdit(null);
    router.refresh();
  };

  if (isCheckingAuth) {
    return (
      <div>
        <DefaultLayout>
          <p className="text-bold text-center text-xl">Authorizing...</p>
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
                {users.length > 0 ? (
                  <UserList
                    users={users}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                  />
                ) : (
                  <p>No users found.</p>
                )}
              </>
            )}
          </div>
        </div>
      </DefaultLayout>
    </div>
  );
}
