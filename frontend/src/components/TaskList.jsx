import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateTask, deleteTask } from '../store/tasksSlice';
import { Pencil, Trash2, Check } from 'lucide-react';

const TaskList = () => {
  const tasks = useSelector((state) => state.tasks.items);
  const dispatch = useDispatch();
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const handleEditClick = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const handleUpdateTask = () => {
    dispatch(updateTask({ id: editingId, title: editTitle, description: editDescription }));
    setEditingId(null);
  };

  const handleDeleteClick = (taskId) => {
    dispatch(deleteTask(taskId));
  };

  const handleCompletedChange = (task) => {
    dispatch(updateTask({ ...task, completed: !task.completed }));
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Task List</h2>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="bg-white shadow rounded-lg p-4">
            {editingId === task.id ? (
              <div>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full mb-2 p-2 border rounded"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full mb-2 p-2 border rounded"
                />
                <button onClick={handleUpdateTask} className="bg-green-500 text-white px-2 py-1 rounded-md mr-2">
                  <Check size={16} />
                </button>
                <button onClick={() => setEditingId(null)} className="bg-gray-500 text-white px-2 py-1 rounded-md">
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleCompletedChange(task)}
                    className="mr-2"
                  />
                  <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.title}</h3>
                </div>
                <p className={`text-gray-600 ${task.completed ? 'line-through' : ''}`}>{task.description}</p>
                <span className={`inline-block px-2 py-1 rounded-full text-sm ${task.completed ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                  {task.completed ? 'Completed' : 'Pending'}
                </span>
                {!task.completed && (
                  <button onClick={() => handleEditClick(task)} className="bg-blue-500 text-white px-2 py-1 rounded-md ml-2">
                    <Pencil size={16} />
                  </button>
                )}
                <button onClick={() => handleDeleteClick(task.id)} className="bg-red-500 text-white px-2 py-1 rounded-md ml-2">
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;