import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const AgentCard = ({ agent, onEdit, onDelete }) => {
  return (
    <motion.div 
      className="card p-5 hover:border hover:border-primary-300"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => onEdit(agent)} 
            className="text-primary-600 hover:text-primary-800 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button 
            onClick={() => onDelete(agent._id)} 
            className="text-red-600 hover:text-red-800 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="mt-3 space-y-2">
        <div className="flex items-center text-gray-600">
          <EnvelopeIcon className="h-4 w-4 mr-2" />
          <span className="text-sm">{agent.email}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <PhoneIcon className="h-4 w-4 mr-2" />
          <span className="text-sm">{agent.phone}</span>
        </div>
      </div>
      
      <div className="mt-4">
        <Link 
          to={`/agents/${agent._id}`} 
          className="text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors duration-200"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
};

export default AgentCard;