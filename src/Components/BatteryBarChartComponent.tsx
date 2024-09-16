import React from 'react';
import { Bar } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const ChartComponent : React.FC<BatteryBarChartProps> = ({ chargingData, consumingData, noChangeData,labels, difference}) => {
  let xLabels : string[]= []
  if(typeof(labels) == 'string')
  {
     xLabels.push(labels)
  }
  else{
    xLabels = labels
  }
  const chartData = {
    labels : xLabels,
    datasets: [
      {
        label: 'Charging',
        data: chargingData,
        backgroundColor: 'rgba(44, 137, 30, 0.4)',
        borderColor: 'rgba(44, 137, 30, 1)',
        borderWidth: 1,
      },
      {
        label: 'Consuming',
        data: consumingData,
        backgroundColor: 'rgba(255, 10, 10, 0.6)',
        borderColor: 'rgba(255, 10, 10, 1)',
        borderWidth: 1,
      },
      {
        label: 'No change',
        data: noChangeData,
        backgroundColor: 'rgba(51, 49, 49, 0.6)',
        borderColor: 'rgba(51, 49, 49, 1)',
        borderWidth: 1,
      },
    ],
  };
  const options = {
     responsive: true, 
     maintainAspectRatio: true,
     maxBarThickness:30,
     plugins: {
      title: {
        display: true,
        text: `${typeof(labels) !== 'string'? 'Battery Charging State from: ' + labels[0] + ' - ' + labels[labels.length - 1] : 'Battery Charging State for ' + labels}`
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) // Custom label function to show the date and difference between two bars (increasing and decreasing values)
          { 
            const dataset = tooltipItem.dataset;
            const index = tooltipItem.dataIndex;
            if(dataset.data.length == 1)
            {
              return `${dataset.data[0]}% : ${difference[index] > 0 
              ? `Increased by ${Math.abs(difference[index])}%`
              : difference[index] < 0 
                ? `Decreased by ${Math.abs(difference[index])}%`
                : 'No Change'}`;       }
            if(index == 0 ) //first bar
            {
                return `${dataset.data[index]}% `; 
            }
            else{
              if(difference[index] != 0)  //consuming or changing bars
              {
                return `${dataset.data[index]}% :  ${difference[index] > 0 ? 'Increased' : 'Decreased'} by ${Math.abs(difference[index])} %`;
              }
              else{
                return `${dataset.data[index]}%`;
              }
            }
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Dates',
          color:'black',
          font: {
            size: 16,
          },
        },
        ticks: {
          autoSkip: false,  // false - > Do not skip any labels
          maxRotation: 90,  // Rotate the labels for better visibility
          minRotation: 90,
          color:'black',
          font: {
            size: 12,
          },
          maxTicksLimit: 50,  // Increase the max limit based on dates length (grid squares on x axis)
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Charging Level (%)',
          color:'black',
          font: {
            size: 16,
          },
        },
      },
     
    },
    
  };

  return (
    <div className="chart-container border border-info">
        <Bar data={chartData} options={options} />
    </div>
  );
  

}

export default ChartComponent