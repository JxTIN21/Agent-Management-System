// src/pages/BatchDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const BatchDetails = () => {
  const { id } = useParams();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchBatch = async () => {
      const res = await api.get(`/lists/batch/${id}`);
      setItems(res.data.data);
    };
    fetchBatch();
  }, [id]);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Batch #{id.slice(0, 8)}...</h1>
      <ul className="list-disc pl-5">
        {items.map((item, index) => (
          <li key={index}>
            {item.firstName} - {item.phone} (Assigned to: {item.assignedTo?.name})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BatchDetails;