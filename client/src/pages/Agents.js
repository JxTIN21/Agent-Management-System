// src/pages/Agents.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import AgentCard from '../components/AgentCard';
import AgentForm from '../components/AgentForm';

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [editingAgent, setEditingAgent] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchAgents = async () => {
    const res = await api.get('/agents');
    setAgents(res.data.data);
  };

  useEffect(() => { fetchAgents(); }, []);

  const handleSubmit = async (data) => {
    try {
      if (editingAgent) {
        await api.put(`/agents/${editingAgent._id}`, data);
        toast.success('Agent updated!');
      } else {
        await api.post('/agents', data);
        toast.success('Agent added!');
      }
      setShowForm(false);
      setEditingAgent(null);
      fetchAgents();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error saving agent');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this agent?')) {
      await api.delete(`/agents/${id}`);
      toast.success('Agent deleted');
      fetchAgents();
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Agents</h1>
        <button onClick={() => { setEditingAgent(null); setShowForm(true); }} className="btn-primary">Add Agent</button>
      </div>
      {showForm && (
        <AgentForm
          agent={editingAgent}
          onSubmit={handleSubmit}
          onCancel={() => { setEditingAgent(null); setShowForm(false); }}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {agents.length ? agents.map(agent => (
          <AgentCard key={agent._id} agent={agent} onEdit={(a) => { setEditingAgent(a); setShowForm(true); }} onDelete={handleDelete} />
        )) : <p>No agents found.</p>}
      </div>
    </div>
  );
};

export default Agents;