import { useState, useEffect } from "react";
import SwitcherThree from "../FormElements/Switchers/SwitcherThree";
import DatePickerOne from "../FormElements/DatePicker/DatePickerOne";
import { User } from "@/types/User";

interface ClassFormProps {
  classData?: any | null;
  onSave: (classData: any) => void;
  onCancel: () => void;
  users: User[];
}

export default function ClassForm({
  classData,
  onSave,
  onCancel,
  users,
}: ClassFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    classID: "",
    professor: "",
    admins: [] as string[],
    students: [] as string[],
    isActive: true,
    startDate: null as Date | null,
    endDate: null as Date | null,
    day1: "",
    day2: "",
    day3: "",
    day4: "",
    day5: "",
    day6: "",
    day7: "",
    examDate: null as Date | null,
  });

  const [dayChecks, setDayChecks] = useState({
    day1: false,
    day2: false,
    day3: false,
    day4: false,
    day5: false,
    day6: false,
    day7: false,
  });
  const [times, setTimes] = useState({
    day1: '',
    day2: '',
    day3: '',
    day4: '',
    day5: '',
    day6: '',
    day7: '',
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);
  useEffect(() => {
    if (classData) {
      setFormData({
        ...classData,
        startDate: classData.startDate ? new Date(classData.startDate) : null,
        endDate: classData.endDate ? new Date(classData.endDate) : null,
        examDate: classData.examDate ? new Date(classData.examDate) : null,
      });
      
      // Set day checks based on provided times
      setDayChecks({
        day1: !!classData.day1,
        day2: !!classData.day2,
        day3: !!classData.day3,
        day4: !!classData.day4,
        day5: !!classData.day5,
        day6: !!classData.day6,
        day7: !!classData.day7,
      });
      setIsEditing(true);
    } else {
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
      setDayChecks({
        day1: false,
        day2: false,
        day3: false,
        day4: false,
        day5: false,
        day6: false,
        day7: false,
      });
      setIsEditing(false);
    }
  }, [classData]);
  
  useEffect(() => {
    if (classData) {
      setDayChecks(classData.dayChecks);
      setTimes(classData.times);
    }
  }, [classData]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setDayChecks(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'time') {
      setTimes(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (name: string, date: Date | null) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: date,
    }));
  };

  const handleMultiSelectChange = (name: string, selectedOptions: any) => {
    const values = Array.from(selectedOptions, (option: any) => option.value);
    setFormData((prevData) => ({
      ...prevData,
      [name]: values,
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

  const handleDayCheck = (day: string) => {
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
  

  const handleSubmit = () => {
    const updatedClassData = {
      ...classData,
      schedule: {
        day1: dayChecks.day1 ? times.day1 : null,
        day2: dayChecks.day2 ? times.day2 : null,
        day3: dayChecks.day3 ? times.day3 : null,
        day4: dayChecks.day4 ? times.day4 : null,
        day5: dayChecks.day5 ? times.day5 : null,
        day6: dayChecks.day6 ? times.day6 : null,
        day7: dayChecks.day7 ? times.day7 : null,
      }
    };

    onSave(updatedClassData);
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
            <select
              name="admins"
              multiple
              value={formData.admins}
              onChange={(e) =>
                handleMultiSelectChange("admins", e.target.selectedOptions)
              }
              className="relative z-10 w-full appearance-none rounded-[7px] border border-stroke bg-transparent px-5.5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2"
            >
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} {user.family_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
              Students
            </label>
            <select
              name="students"
              multiple
              value={formData.students}
              onChange={(e) =>
                handleMultiSelectChange("students", e.target.selectedOptions)
              }
              className="relative z-10 w-full appearance-none rounded-[7px] border border-stroke bg-transparent px-5.5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2"
            >
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} {user.family_name} {user.student_number}
                </option>
              ))}
            </select>
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

          {["day1", "day2", "day3", "day4", "day5", "day6", "day7"].map((day) => (
            <div key={day}>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={dayChecks[day]}
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
                  value={formData[day]}
                  onChange={handleChange}
                  placeholder={`Day ${day.charAt(day.length - 1)}`}
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                />
              )}
            </div>
          ))}

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
