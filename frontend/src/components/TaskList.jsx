import React from 'react';
import { useSelector } from 'react-redux';

const TaskList = () => {
  const tasks = useSelector((state) => state.tasks.items);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Task List</h2>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="bg-white shadow rounded-lg p-4">
            <h3 className="font-medium">{task.title}</h3>
            <p className="text-gray-600">{task.description}</p>
            <span className={`inline-block px-2 py-1 rounded-full text-sm ${task.completed ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
              {task.completed ? 'Completed' : 'Pending'}
            </span>
            {!task.completed && <button onClick={() => handleEditClick(task)} className="bg-blue-500 text-white px-2 py-1 rounded-md ml-2">Edit</button>}
            <button onClick={() => handleDeleteClick(task.id)} className="bg-red-500 text-white px-2 py-1 rounded-md ml-2">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;