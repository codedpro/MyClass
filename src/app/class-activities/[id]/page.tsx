import React from "react";
import { cookies } from "next/headers";
import { ClassActivity } from "@/types/ClassActivity";
import AdminView from "@/components/Activities/AdminView";
import StudentView from "@/components/Activities/StudentView";
import { fetchClassActivity } from "@/lib/fetchClassActivity";
import { verifyToken } from "@/lib/auth";
import { DecodedToken } from "@/types/DecodedToken";

const ClassActivityPage: React.FC<{ params: { id: string } }> = async ({
  params,
}) => {
  const { id } = params;

  const cookiesStore = cookies();
  const userToken = cookiesStore.get("token")?.value;

  if (!userToken) {
    return <div className="text-red-500">Access denied: No token provided</div>;
  }

  const decodedToken = verifyToken(userToken) as DecodedToken;

  if (!decodedToken || !decodedToken.role) {
    return <div className="text-red-500">Access denied: Invalid token</div>;
  }

  const userRole = decodedToken.role;

  try {
    const activity = await fetchClassActivity(id);

    if (!activity) {
      return <div className="text-red-500">Class activity not found</div>;
    }

    return (
      <div className="">
        {userRole === "Admin" ? (
          <AdminView activity={activity} />
        ) : (
          <StudentView activity={activity} />
        )}
      </div>
    );
  } catch (error: any) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }
};

export default ClassActivityPage;
