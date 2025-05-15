import React from 'react';
import { motion } from 'framer-motion';

const DashboardCard = ({ title, value, icon: Icon, color }) => {
  return (
    <motion.div 
      className="card p-6"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center">
        <div className={`rounded-full p-3 ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-xl font-semibold text-gray-900 mt-1">{value}</h3>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardCard;