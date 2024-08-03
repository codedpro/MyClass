"use client";
import React, { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

interface ClassEvent {
  name: string;
  start: string;
  end: string;
}

interface CalendarEvent {
  date: string;
  classes: ClassEvent[];
}

const hardcodedEvents: CalendarEvent[] = [
  { date: '2024-08-02', classes: [{ name: 'Math', start: '09:00', end: '10:00' }, { name: 'Science', start: '10:30', end: '11:30' }, { name: 'History', start: '13:00', end: '14:00' }] },
  { date: '2024-08-03', classes: [{ name: 'Art', start: '09:00', end: '10:00' }, { name: 'PE', start: '10:30', end: '11:30' }, { name: 'Music', start: '13:00', end: '14:00' }] },
  // Add more hardcoded events here
];

const CalendarBox: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDateEvents, setSelectedDateEvents] = useState<ClassEvent[]>([]);
  const currentDate = new Date();

  useEffect(() => {
    setEvents(hardcodedEvents);
  }, []);

  const getEventForDate = (date: string): CalendarEvent | undefined => {
    return events.find(event => event.date === date);
  };

  const handleViewMoreClick = (dateEvents: ClassEvent[]) => {
    setSelectedDateEvents(dateEvents);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDateEvents([]);
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const renderCalendarCells = () => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const cells = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(<td key={`empty-start-${i}`} className="border border-stroke dark:border-dark-3"></td>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const event = getEventForDate(date);
      const isToday = date === currentDate.toISOString().split('T')[0];
      cells.push(
        <td key={day} className={`relative h-20 cursor-pointer border border-stroke p-2 opacity-40 transition duration-500 hover:bg-gray-200 dark:border-dark-3 dark:hover:bg-dark-2 md:h-25 md:p-6 xl:h-31 ${isToday ? 'opacity-100 dark:opacity-100' : ''}`}>
          <span className="font-medium text-dark dark:text-white">{day}</span>
          {event && (
            <div className="mt-1 text-sm text-gray-700 dark:text-gray-300 flex flex-col justify-end h-full">
              {event.classes.length > 0 && (
                <div className="text-primary text-xs mb-6 cursor-pointer md:hidden" onClick={() => handleViewMoreClick(event.classes)}>
                  View
                </div>
              )}
              <div className="hidden md:block">
                {event.classes.slice(0, 2).map((classEvent: ClassEvent, index: number) => (
                  <div key={index} className="text-sm">{classEvent.name}</div>
                ))}
                {event.classes.length > 2 && (
                  <div className="text-primary mb-2 cursor-pointer" onClick={() => handleViewMoreClick(event.classes)}>
                    View more
                  </div>
                )}
              </div>
            </div>
          )}
        </td>
      );
    }

    while (cells.length % 7 !== 0) {
      cells.push(<td key={`empty-end-${cells.length}`} className="border border-stroke dark:border-dark-3"></td>);
    }

    return cells;
  };

  return (
    <div className="w-full max-w-full rounded-lg bg-white shadow-md dark:bg-gray-800 dark:shadow-lg">
      <table className="w-full">
        <thead>
          <tr className="grid grid-cols-7 rounded-t-lg bg-primary text-white">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
              <th key={day} className="flex h-15 items-center justify-center p-2 text-sm font-medium sm:text-base xl:p-4">
                <span className="hidden lg:block">{day}</span>
                <span className="block lg:hidden">{day.slice(0, 3)}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: Math.ceil(renderCalendarCells().length / 7) }, (_, rowIndex) => (
            <tr key={rowIndex} className="grid grid-cols-7">
              {renderCalendarCells().slice(rowIndex * 7, (rowIndex + 1) * 7)}
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={handleModalClick}>
          <div className="relative w-11/12 max-w-lg rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-gray-700 dark:text-gray-300" onClick={closeModal}>
              <AiOutlineClose size={24} />
            </button>
            <h2 className="mb-4 text-xl font-bold text-dark dark:text-white">Events</h2>
            {selectedDateEvents.map((classEvent, index) => (
              <div key={index} className="mb-4">
                <div className="font-medium text-dark dark:text-white">{classEvent.name}</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">{classEvent.start} - {classEvent.end}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarBox;
