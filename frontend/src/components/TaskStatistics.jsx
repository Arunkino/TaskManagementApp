import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../utils/axiosConfig';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const TaskStatistics = () => {
  const [stats, setStats] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const tasks = useSelector((state) => state.tasks.items);

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('tasks/statistics/');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchStats();
    }
  }, [token, tasks]); // Re-fetch stats when tasks change

  if (!stats) {
    return <div>Loading statistics...</div>;
  }

  const chartData = Object.entries(stats.tasks_by_day).map(([day, count]) => ({ day, count }));

  const pieChartData = [
    { name: 'Completed', value: stats.completed_tasks },
    { name: 'Pending', value: stats.pending_tasks },
  ];

  const COLORS = ['#0088FE', '#00C49F'];

  return (
    <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">Task Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Tasks" value={stats.total_tasks} color="bg-blue-100 text-blue-800" />
        <StatCard title="Completed Tasks" value={stats.completed_tasks} color="bg-green-100 text-green-800" />
        <StatCard title="Pending Tasks" value={stats.pending_tasks} color="bg-yellow-100 text-yellow-800" />
        <StatCard title="Tasks Last 7 Days" value={stats.tasks_last_7_days} color="bg-purple-100 text-purple-800" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="font-medium mb-4 text-center">Tasks by Day of Week</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className="font-medium mb-4 text-center">Task Completion Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }) => (
  <div className={`${color} rounded-lg p-4 flex flex-col items-center justify-center`}>
    <h3 className="font-medium text-center">{title}</h3>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

export default TaskStatistics;