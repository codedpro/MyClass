import { FC, useState } from "react";
import Image from "next/image";
import { FiEdit, FiTrash } from "react-icons/fi";
import { User } from "@/types/User";

interface UserListProps {
  users: User[];
  handleEdit: (user: User) => void;
  handleDelete: (userId: string) => void;
}

const UserList: FC<UserListProps> = ({ users, handleEdit, handleDelete }) => {
  const [visibleUsersCount, setVisibleUsersCount] = useState(15);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLoadMore = () => {
    setVisibleUsersCount((prevCount) => prevCount + 15);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.family_name} ${user.student_number}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const visibleUsers = filteredUsers.slice(0, visibleUsersCount);

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h4 className="mb-6 text-body-2xlg font-bold text-dark dark:text-white">
        User List
      </h4>

      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search users"
        className="w-full  mb-4 rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
      />

      <div className="flex flex-col">
        <div className="grid grid-cols-6 sm:grid-cols-7 gap-29 md:gap-34">
          <div className="col-span-2 pb-3.5"></div>

          <div className="text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">SN</h5>
          </div>

          <div className="text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Actions
            </h5>
          </div>
        </div>

        {visibleUsers.map((user, key) => (
          <div
            className={`grid grid-cols-6 sm:grid-cols-7 gap-32 md:gap-36 ${
              key === visibleUsers.length - 1
                ? ""
                : "border-b border-stroke dark:border-dark-3"
            }`}
            key={user._id}
          >
            <div className="flex items-center gap-2 px-2 py-4 col-span-2 whitespace-nowrap">
              <Image
                src={user.profile}
                alt="Profile"
                width={48}
                height={48}
                className="rounded-full"
              />
              <p className="font-medium text-dark dark:text-white">
                {user.name} {user.family_name}
              </p>
            </div>

            <div className="flex items-center justify-center px-2 py-4 whitespace-nowrap">
              <p className="font-medium text-center text-dark dark:text-white">
                {user.student_number}
              </p>
            </div>

            <div className="flex items-center justify-center py-4 gap-2  md:ml-3 whitespace-nowrap">
              <button
                onClick={() => handleEdit(user)}
                className="bg-primary hover:opacity-80 text-white p-1 rounded flex items-center justify-center"
              >
                <FiEdit size={16} />
              </button>
              <button
                onClick={() => handleDelete(user._id)}
                className="bg-red-500 hover:opacity-80 text-white p-1 rounded flex items-center justify-center"
              >
                <FiTrash size={16} />
              </button>
            </div>
          </div>
        ))}

        {visibleUsersCount < filteredUsers.length && (
          <button
            onClick={handleLoadMore}
            className="mt-4 bg-primary hover:opacity-80 text-white p-2 rounded"
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default UserList;
