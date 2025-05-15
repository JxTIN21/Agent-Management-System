// src/pages/ListDistribution.js
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

const ListDistribution = () => {
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select a file');
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post('/lists/upload', formData);
      toast.success('List distributed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed');
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Upload List for Distribution</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".csv,.xlsx,.xls" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit" className="btn-primary mt-2">Upload</button>
      </form>
    </div>
  );
};

export default ListDistribution;