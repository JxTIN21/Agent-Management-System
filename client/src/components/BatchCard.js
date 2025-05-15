import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClockIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const BatchCard = ({ batch }) => {
  const formattedDate = new Date(batch.createdAt).toLocaleDateString();
  
  return (
    <motion.div 
      className="card p-5"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-900 truncate" title={batch._id}>
          Batch #{batch._id.substring(0, 8)}...
        </h3>
      </div>
      
      <div className="mt-3 space-y-2">
        <div className="flex items-center text-gray-600">
          <DocumentTextIcon className="h-4 w-4 mr-2" />
          <span className="text-sm">{batch.count} items</span>
        </div>
        <div className="flex items-center text-gray-600">
          <ClockIcon className="h-4 w-4 mr-2" />
          <span className="text-sm">{formattedDate}</span>
        </div>
      </div>
      
      <div className="mt-4">
        <Link 
          to={`/batches/${batch._id}`} 
          className="text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors duration-200"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
};

export default BatchCard;