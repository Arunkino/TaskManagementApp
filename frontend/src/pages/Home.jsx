import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../store/tasksSlice';
import TaskList from '../components/TaskList';
import AddTask from '../components/AddTask';
import TaskStatistics from '../components/TaskStatistics';
import { LoadingSpinner } from '../components/LoadingSpinner';

function Home() {
    const dispatch = useDispatch();
    const { status, error } = useSelector((state) => state.tasks);
  
    useEffect(() => {
      if (status === 'idle') {
        dispatch(fetchTasks());
      }
    }, [status, dispatch]);

    if (status === 'loading') {
      return <div className="flex justify-center items-center h-screen"><LoadingSpinner/></div>;
    }

    if (status === 'failed') {
      return <div className="text-red-500 text-center p-4">Error: {error}</div>;
    }

    return (
      <div className="container mx-auto p-4 max-w-7xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Task Management Dashboard</h1>
        <div className="grid grid-cols-1 lg:grid-cols-9 gap-8">
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <AddTask />
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <TaskList />
            </div>
          </div>
          <div className="lg:col-span-5">
            <TaskStatistics />
          </div>
        </div>
      </div>
    );
}

export default Home;