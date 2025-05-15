import React, { useEffect, useState } from 'react';
import api from '../services/api';
import DashboardCard from '../components/DashboardCard';
import { UsersIcon, CubeIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [agents, setAgents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [lists, setLists] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const agentsRes = await api.get('/agents');
        const batchesRes = await api.get('/lists/batches');
        const listsRes = await api.get('/lists');

        setAgents(agentsRes.data.data);
        setBatches(batchesRes.data.data);
        setLists(listsRes.data.data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load data');
      }
    };

    fetchData();
  }, []);

  if (error) return <div className="text-red-600 font-semibold">{error}</div>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <DashboardCard 
          title="Total Agents"
          value={agents.length}
          icon={UsersIcon}
          color="bg-blue-600"
        />
        <DashboardCard 
          title="Total Batches"
          value={batches.length}
          icon={CubeIcon}
          color="bg-green-600"
        />
        <DashboardCard 
          title="Total Lists"
          value={lists.length}
          icon={ClipboardDocumentListIcon}
          color="bg-purple-600"
        />
      </div>
    </div>
  );
};

export default Dashboard;