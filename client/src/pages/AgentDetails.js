// src/pages/AgentDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const AgentDetails = () => {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      const agentRes = await api.get(`/agents/${id}`);
      const itemsRes = await api.get(`/lists/agent/${id}`);
      setAgent(agentRes.data.data);
      setItems(itemsRes.data.data);
    };
    fetchDetails();
  }, [id]);

  return (
    <div>
      <h1 className="text-xl font-bold mb-2">{agent?.name}</h1>
      <p className="text-gray-700 mb-4">{agent?.email} • {agent?.phone}</p>
      <h2 className="text-lg font-semibold mb-2">Assigned List Items</h2>
      <ul className="list-disc pl-5">
        {items.map((item, index) => (
          <li key={index}>{item.firstName} - {item.phone}</li>
        ))}
      </ul>
    </div>
  );
};

export default AgentDetails;