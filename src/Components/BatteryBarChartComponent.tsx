import React, { useState } from 'react';
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


const ChartComponent : React.FC<BatteryBarChartProps> = ({labels, difference, dataArray, colorArray}) => {
  const [legendVisibility, setLegendVisibility] = useState({ Charging: true, Consuming: true, NoChange: true });
 
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Status',
        data: dataArray,
        backgroundColor: colorArray,
        borderColor: colorArray,
        borderWidth: 1,
      },
    ],
    
  };
  const options = {
     responsive: true, 
     maintainAspectRatio: true,
     maxBarThickness:30,
     categoryPercentage: 0.5,
     barPercentage: 1.0,
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
              return `${dataset.data[0]}%  ${difference[index] > 0 
              ? `Increased by ${Math.abs(difference[index])}%`
              : difference[index] < 0 
                ? `Decreased by ${Math.abs(difference[index])}%`
                : ''}`;       
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
      legend: {
        display: true,
        labels: {
          generateLabels: (chart) => {
            const colors = ['rgba(44, 137, 30, 0.4)', 'rgba(255, 10, 10, 0.6)', 'rgba(51, 49, 49, 0.6)'];
            const types = ['Charging', 'Consuming', 'NoChange'];
           
            return types.map((type, i) => ({
              text: type,
              fillStyle: colors[i],
              strokeStyle: colors[i],
              datasetIndex: 0,
              hidden: !legendVisibility[type],  // Toggle visibility state
              fontColor: legendVisibility[type] ? '#000000' : 'red',  // Change color when hidden
              textDecoration: legendVisibility[type] ? 'none' : 'line-through',  // Strike-through when hidden
              
            }));

          },
        },
        onClick: (e, legendItem) => {
          const chart = e.chart;
          const type = legendItem.text;

          // Toggle the visibility 
          setLegendVisibility((prev) => ({
            ...prev,
            [type]: !prev[type],
          }));

          chart.getDatasetMeta(0).data.forEach((bar, i) => {
            if (bar.options.backgroundColor === legendItem.strokeStyle) {
              bar.hidden = legendVisibility[type];  // Invert the visibility logic
            }
          });

          chart.update();
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