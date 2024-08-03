import { FC, useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import { Class } from "@/types/Class";

interface ClassListProps {
  classes: Class[];
  handleEdit: (classData: Class) => void;
  handleDelete: (classId: string) => void;
}

const ClassList: FC<ClassListProps> = ({
  classes,
  handleEdit,
  handleDelete,
}) => {
  const [visibleClassesCount, setVisibleClassesCount] = useState(15);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLoadMore = () => {
    setVisibleClassesCount((prevCount) => prevCount + 15);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredClasses = classes.filter((classData) =>
    `${classData.name} ${classData.classID}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const visibleClasses = filteredClasses.slice(0, visibleClassesCount);

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h4 className="mb-6 text-body-2xlg font-bold text-dark dark:text-white">
        Class List
      </h4>

      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search classes"
        className="w-full mb-4 rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
      />

      <div className="flex flex-col">
        <div className="grid grid-cols-6 sm:grid-cols-7 gap-20 md:gap-20 text-center">
          <div className="col-span-2 pb-3.5">
            <h5 className="text-sm font-medium uppercase xsm:text-base ">
              Name
            </h5>
          </div>

          <div className="text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">ID</h5>
          </div>

          <div className="text-center col-span-2">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Actions
            </h5>
          </div>
        </div>

        {visibleClasses.map((classData, key) => (
          <div
            className={`grid grid-cols-6 sm:grid-cols-7 gap-20 md:gap-20 ${
              key === visibleClasses.length - 1
                ? ""
                : "border-b border-stroke dark:border-dark-3"
            }`}
            key={classData._id}
          >
            <div className="flex items-center gap-2 px-2 py-4 col-span-2 whitespace-nowrap">
              <p className="font-medium text-dark dark:text-white">
                {classData.name}
              </p>
            </div>

            <div className="flex items-center justify-center px-2 py-4 whitespace-nowrap">
              <p className="font-medium text-center text-dark dark:text-white">
                {classData.classID}
              </p>
            </div>

            <div className="flex items-center justify-center py-4 gap-2 col-span-2 whitespace-nowrap">
              <button
                onClick={() => handleEdit(classData)}
                className="bg-primary hover:opacity-80 text-white p-1 rounded flex items-center justify-center"
              >
                <FiEdit size={16} />
              </button>
              <button
                onClick={() => handleDelete(classData._id)}
                className="bg-red-500 hover:opacity-80 text-white p-1 rounded flex items-center justify-center"
              >
                <FiTrash size={16} />
              </button>
            </div>
          </div>
        ))}

        {visibleClassesCount < filteredClasses.length && (
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

export default ClassList;
