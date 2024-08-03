import { useState, useEffect } from "react";
import SwitcherThree from "../FormElements/Switchers/SwitcherThree";
import DatePickerOne from "../FormElements/DatePicker/DatePickerOne";

interface ClassFormProps {
  classData?: any | null;
  onSave: (classData: any) => void;
  onCancel: () => void;
}
type FormData = {
  name: string;
  description: string;
  classID: string;
  professor: string;
  admins: string[];
  students: string[];
  isActive: boolean;
  startDate: Date | null;
  endDate: Date | null;
  examDate: Date | null;
  day1?: string;
  day2?: string;
  day3?: string;
  day4?: string;
  day5?: string;
  day6?: string;
  day7?: string;
};
type Day = "day1" | "day2" | "day3" | "day4" | "day5" | "day6" | "day7";
const dayChecks: { [key in Day]?: boolean } = {};

export default function ClassForm({
  classData,
  onSave,
  onCancel,
}: ClassFormProps) {
  const days: Day[] = ["day1", "day2", "day3", "day4", "day5", "day6", "day7"];

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    classID: "",
    professor: "",
    admins: [],
    students: [],
    isActive: true,
    startDate: null,
    endDate: null,
    examDate: null,
    ...["day1", "day2", "day3", "day4", "day5", "day6", "day7"].reduce(
      (acc, day) => {
        acc[day] = "";
        return acc;
      },
      {} as Record<string, string>
    ),
  });
  const [dayChecks, setDayChecks] = useState<Record<string, boolean>>({
    day1: false,
    day2: false,
    day3: false,
    day4: false,
    day5: false,
    day6: false,
    day7: false,
  });

  const [times, setTimes] = useState<Record<string, string>>({
    day1: "",
    day2: "",
    day3: "",
    day4: "",
    day5: "",
    day6: "",
    day7: "",
  });

  const [newAdmin, setNewAdmin] = useState<string>("");
  const [newStudent, setNewStudent] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  useEffect(() => {
    if (classData) {
      const schedule = classData.schedule || {};
      setFormData({
        ...classData,
        startDate: classData.startDate ? new Date(classData.startDate) : null,
        endDate: classData.endDate ? new Date(classData.endDate) : null,
        examDate: classData.examDate ? new Date(classData.examDate) : null,
        admins: classData.admins || [],
        students: classData.students || [],
      });
      setDayChecks({
        day1: !!schedule.day1,
        day2: !!schedule.day2,
        day3: !!schedule.day3,
        day4: !!schedule.day4,
        day5: !!schedule.day5,
        day6: !!schedule.day6,
        day7: !!schedule.day7,
      });
      setTimes({
        day1: schedule.day1 || "",
        day2: schedule.day2 || "",
        day3: schedule.day3 || "",
        day4: schedule.day4 || "",
        day5: schedule.day5 || "",
        day6: schedule.day6 || "",
        day7: schedule.day7 || "",
      });
      setIsEditing(true);
    }
  }, [classData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (name: string, date: Date | null) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: date,
    }));
  };

  const handleCancel = () => {
    onCancel();
    setFormData({
      name: "",
      description: "",
      classID: "",
      professor: "",
      admins: [],
      students: [],
      isActive: true,
      startDate: null,
      endDate: null,
      day1: "",
      day2: "",
      day3: "",
      day4: "",
      day5: "",
      day6: "",
      day7: "",
      examDate: null,
    });
    setIsEditing(false);
    setDayChecks({
      day1: false,
      day2: false,
      day3: false,
      day4: false,
      day5: false,
      day6: false,
      day7: false,
    });
  };

  const handleToggle = (newState: boolean) => {
    setFormData((prevData) => ({
      ...prevData,
      isActive: newState,
    }));
  };

  const handleDayCheck = (day: Day) => {
    setDayChecks((prevChecks) => {
      const newCheck = !prevChecks[day];
      setFormData((prevData) => ({
        ...prevData,
        [day]: newCheck ? prevData[day] : "",
      }));
      return {
        ...prevChecks,
        [day]: newCheck,
      };
    });
  };

  const addAdmin = () => {
    if (newAdmin.trim()) {
      setFormData((prevData) => ({
        ...prevData,
        admins: [...prevData.admins, newAdmin.trim()],
      }));
      setNewAdmin("");
    }
  };

  const removeAdmin = (index: number) => {
    setFormData((prevData) => {
      const updatedAdmins = [...prevData.admins];
      updatedAdmins.splice(index, 1);
      return { ...prevData, admins: updatedAdmins };
    });
  };

  const addStudent = () => {
    if (newStudent.trim()) {
      setFormData((prevData) => ({
        ...prevData,
        students: [...prevData.students, newStudent.trim()],
      }));
      setNewStudent("");
    }
  };

  const removeStudent = (index: number) => {
    setFormData((prevData) => {
      const updatedStudents = [...prevData.students];
      updatedStudents.splice(index, 1);
      return { ...prevData, students: updatedStudents };
    });
  };

  const handleSubmit = () => {
    const dataToSave = {
      ...formData,
      ...times,
    };
    onSave(dataToSave);
  };

  return (
    <div>
      <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
        <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
          <h3 className="font-medium text-dark dark:text-white">
            {isEditing ? "Edit Class" : "Add New Class"}
          </h3>
        </div>
        <div className="flex flex-col gap-5.5 p-6.5">
          <div>
            <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
              Class Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Class Name"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
              Class ID
            </label>
            <input
              type="text"
              name="classID"
              value={formData.classID}
              onChange={handleChange}
              placeholder="Class ID"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
              Professor
            </label>
            <input
              type="text"
              name="professor"
              value={formData.professor}
              onChange={handleChange}
              placeholder="Professor"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
              Admins
            </label>
            <div className="flex items-center mb-3">
              <input
                type="text"
                value={newAdmin}
                onChange={(e) => setNewAdmin(e.target.value)}
                placeholder="Enter admin code"
                className="flex-1 rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
              <button
                type="button"
                onClick={addAdmin}
                className="ml-3 rounded-[7px] border border-primary bg-primary px-4 py-2 font-medium text-body text-white transition duration-300 hover:bg-primary-600"
              >
                Add
              </button>
            </div>
            <ul>
              {formData.admins.map((admin, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between border-b py-2"
                >
                  <span className="text-body-sm text-dark dark:text-white">
                    {admin}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeAdmin(index)}
                    className="text-red-600 dark:text-red-400"
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
              Students
            </label>
            <div className="flex items-center mb-3">
              <input
                type="text"
                value={newStudent}
                onChange={(e) => setNewStudent(e.target.value)}
                placeholder="Enter student code"
                className="flex-1 rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
              <button
                type="button"
                onClick={addStudent}
                className="ml-3 rounded-[7px] border border-primary bg-primary px-4 py-2 font-medium text-body text-white transition duration-300 hover:bg-primary-600"
              >
                Add
              </button>
            </div>
            <ul>
              {formData.students.map((student, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between border-b py-2"
                >
                  <span className="text-body-sm text-dark dark:text-white">
                    {student}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeStudent(index)}
                    className="text-red-600 dark:text-red-400"
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
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
            <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
              Start Date
            </label>
            <DatePickerOne
              selectedDate={formData.startDate}
              onDateChange={(date: Date | null) =>
                handleDateChange("startDate", date)
              }
            />
          </div>
          <div>
            <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
              End Date
            </label>
            <DatePickerOne
              selectedDate={formData.endDate}
              onDateChange={(date: Date | null) =>
                handleDateChange("endDate", date)
              }
            />
          </div>
          <div>
            <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
              Exam Date
            </label>
            <DatePickerOne
              selectedDate={formData.examDate}
              onDateChange={(date: Date | null) =>
                handleDateChange("examDate", date)
              }
            />
          </div>
          {days.map((day) => (
            <div key={day}>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={dayChecks[day] || false}
                  onChange={() => handleDayCheck(day)}
                  className="mr-2"
                />
                <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
                  {`Day ${day.charAt(day.length - 1)}`}
                </label>
              </div>
              {dayChecks[day] && (
                <input
                  type="time"
                  name={day}
                  value={times[day]}
                  onChange={(e) =>
                    setTimes((prev) => ({ ...prev, [day]: e.target.value }))
                  }
                  placeholder={`Day ${day.charAt(day.length - 1)}`}
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                />
              )}
            </div>
          ))}
     
          <div className="flex justify-end gap-4.5">
            <button
              onClick={handleCancel}
              className="rounded-[7px] border border-stroke bg-gray-2 px-6 py-2 font-medium text-body text-dark transition duration-300 hover:border-gray-3 hover:bg-gray-3 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:border-dark-2 dark:hover:bg-gray-dark"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="rounded-[7px] border border-primary bg-primary px-6 py-2 font-medium text-body text-white transition duration-300 hover:bg-primary-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
