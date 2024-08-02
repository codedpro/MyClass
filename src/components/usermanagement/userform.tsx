import { useState, useEffect } from "react";
import SwitcherThree from "../FormElements/Switchers/SwitcherThree";
import { User } from "@/types/User";
interface UserFormProps {
  user?: User | null;
  onSave: (user: User) => void;
  onCancel: () => void;
}

export default function UserForm({ user, onSave, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState<User>({
    name: "",
    family_name: "",
    email: "",
    student_number: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
    isActive: true,
    usertype: "",
    role: "",
    profile: "/images/user/user-03.png",
    _id: "",
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setFormData(user);
      setIsEditing(true);
    } else {
      setFormData({
        name: "",
        family_name: "",
        email: "",
        student_number: "",
        password: "",
        confirmPassword: "",
        phone_number: "",
        isActive: true,
        usertype: "",
        role: "",
        profile: "/images/user/user-03.png",
        _id: "",
      });
      setIsEditing(false);
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    onCancel();
    setFormData({
      name: "",
      family_name: "",
      email: "",
      student_number: "",
      password: "",
      confirmPassword: "",
      phone_number: "",
      isActive: true,
      usertype: "",
      role: "",
      profile: "/images/user/user-03.png",
      _id: "",
    });
    setIsEditing(false);
  };
  const handleToggle = (newState: boolean) => {
    setFormData((prevData) => ({
      ...prevData,
      isActive: newState,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    // Handle date change logic here
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      onSave(formData);
    }
  };

  const isFormValid = () => {
    return (
      formData.name &&
      formData.family_name &&
      formData.email &&
      formData.student_number &&
      formData.password &&
      formData.confirmPassword &&
      formData.usertype &&
      formData.role &&
      formData.password === formData.confirmPassword
    );
  };
  console.log(formData);
  return (
    <div>
      <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
        <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
          <h3 className="font-medium text-dark dark:text-white">
            {isEditing ? "Edit User" : "Add New User"}
          </h3>
        </div>
        <div className="flex flex-col gap-5.5 p-6.5">
          <div className="flex flex-row gap-5.5">
            <div>
              <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
                First Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
                Last Name
              </label>
              <input
                type="text"
                name="family_name"
                value={formData.family_name}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              Student Number
            </label>
            <input
              type="text"
              name="student_number"
              value={formData.student_number}
              onChange={handleChange}
              placeholder="Student Number"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              Active
            </label>
            <SwitcherThree
              enabled={formData.isActive}
              onToggle={handleToggle}
            />
          </div>
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              User type
            </label>
            <select
              name="usertype"
              value={formData.usertype}
              onChange={handleChange}
              className="relative z-10 w-full appearance-none rounded-[7px] border border-stroke bg-transparent px-5.5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 "
            >
              <option value="">Select user type</option>
              <option value="Normal">Normal</option>
              <option value="VIP">VIP</option>
              <option value="VIP+">VIP+</option>
            </select>
          </div>
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="relative z-10 w-full appearance-none rounded-[7px] border border-stroke bg-transparent px-5.5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 "
            >
              <option value="">Select Role</option>
              <option value="Student">Student</option>{" "}
              <option value="Professor">Professor</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className={`px-4 py-2 rounded bg-primary text-white ${!isFormValid() ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isEditing ? "Save" : "Add"}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded bg-secondary text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
