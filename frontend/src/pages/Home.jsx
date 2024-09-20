import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../store/tasksSlice';
import TaskList from '../components/TaskList';
import AddTask from '../components/AddTask';
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
      <AddTask />
      <TaskList />
    </div>
  );
}

export default Home
