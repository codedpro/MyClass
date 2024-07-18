import { useEffect, useState } from 'react';
import { UserService } from "@/services/userService";

interface User {
  name: string | null;
  family_name: string | null;
  email: string | null;
  phone_number: string | null;
  student_number: string | null;
}

const UserProfile = () => {
  const [user, setUser] = useState<User>({
    name: null,
    family_name: null,
    email: null,
    phone_number: null,
    student_number: null
  });

  useEffect(() => {
    const userService = new UserService();
    setUser({
      name: userService.getName() ?? '',
      family_name: userService.getFamilyName() ?? '',
      email: userService.getEmail() ?? '',
      phone_number: userService.getPhoneNumber() ?? '',
      student_number: userService.getStudentNumber() ?? '',
    });
  }, []);

  return (
    <div>
      <h1>User Profile</h1>
      <p>Name: {user.name}</p>
      <p>Family Name: {user.family_name}</p>
      <p>Email: {user.email}</p>
      <p>Phone Number: {user.phone_number}</p>
      <p>Student Number: {user.student_number}</p>
    </div>
  );
};

export default UserProfile;
