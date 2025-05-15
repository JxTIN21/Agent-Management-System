import React, { useEffect, useState } from 'react';
import api from '../services/api';
import BatchCard from '../components/BatchCard';

const Batches = () => {
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    const fetchBatches = async () => {
      const res = await api.get('/lists/batches');
      setBatches(res.data.data);
    };
    fetchBatches();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Batches</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {batches.length > 0 ? (
          batches.map(batch => (
            <BatchCard key={batch._id} batch={batch} />
          ))
        ) : (
          <p className="text-gray-600">No batches found.</p>
        )}
      </div>
    </div>
  );
};

export default Batches;