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
      return <div className="text-red-500 text-center">Error: {error}</div>;
    }

    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Task Management App</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AddTask />
            <TaskList />
          </div>
          <div>
            <TaskStatistics />
          </div>
        </div>
      </div>
    );
}

export default Home