import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the required components from Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ data, options }) => {
  return <Bar style={{maxWidth: '32rem', maxHeight: '16rem'}} data={data} options={options} />;
};

export default BarChart;
