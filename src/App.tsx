import React, { useEffect, useRef, useState } from 'react';
import HeaderComponent from './Components/HeaderComponent';
import BatteryBarChartComponent from "./Components/BatteryBarChartComponent"
import { fetchBatteryData, getIntervalEventDetails } from './store/battery';

const App : React.FC = () => {
  const [dataArray, setDataArray] = useState<number[]>([]);
  const [colorArray, setColorArray] = useState<string[]>([]);
  const [batteryData, setBatteryData] = useState<BatteryDataResponse | null>(null)
  const [differenceData, setDifferenceData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [eventId, setEventId] = useState<number | null>(null);
  const [reloadFlag, setReloadFlag] = useState<number>(0)
  const inputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    // Fetch the battery data
    fetchBatteryData().then((data) => {
      setBatteryData(data as BatteryDataResponse); 
      processBatteryData(data as BatteryDataResponse); // call function to process data for the chart
    }).catch(err => {
      console.error("Error fetching battery data:", err);
    });
  }, [reloadFlag]); //fetchData when user entered invalid/empty event id to reload the chart with all data

  
  const processBatteryData = (batteryData : BatteryDataResponse) => {
    const difference = [];
    const label = [];
    const processedData: number[] = [];
   const processedColors: string[] = [];
    const data = batteryData.chargingStates
      if(data[0].chargingLevel < data[1].chargingLevel)  //charging
      {
          processedData.push(data[0].chargingLevel)
          processedColors.push('rgba(44, 137, 30, 0.4)'); // Green for charging
          label.push(new Date(data[0].date).toLocaleString())  //to convert given date format to user time format
          difference.push(0)

      }
      else if(data[0].chargingLevel > data[1].chargingLevel)  //consuming
      {
        processedData.push(data[0].chargingLevel)
        processedColors.push('rgba(255, 10, 10, 0.6)'); // Red for consuming
        label.push(new Date(data[0].date).toLocaleString())
        difference.push(0)
      }
      else //no change
      {
        processedData.push(data[0].chargingLevel)
        processedColors.push('rgba(51, 49, 49, 0.6)'); // Gray for no change
        label.push(new Date(data[0].date).toLocaleString())
        difference.push(0)
      }
    
    for(let i = 1 ; i<data.length ; i++){
      if(data[i].chargingLevel > data[i-1].chargingLevel)  //charging
      {
          processedData.push(data[i].chargingLevel)
          processedColors.push('rgba(44, 137, 30, 0.4)'); // Green for charging
          label.push(new Date(data[i].date).toLocaleString())
          difference.push(data[i].chargingLevel - data[i-1].chargingLevel)

      }
      else if(data[i].chargingLevel < data[i-1].chargingLevel)  //consuming
      {
        processedData.push(data[i].chargingLevel)
        processedColors.push('rgba(255, 10, 10, 0.6)'); // Red for consuming
        label.push(new Date(data[i].date).toLocaleString())
        difference.push(data[i].chargingLevel - data[i-1].chargingLevel)

      }
      else //no change
      {
        processedData.push(data[i].chargingLevel)
        processedColors.push('rgba(51, 49, 49, 0.6)'); // Gray for no change
        label.push(new Date(data[i].date).toLocaleString())
        difference.push(data[i].chargingLevel - data[i-1].chargingLevel)

      }
    }
    setDataArray(processedData);
    setColorArray(processedColors);
    setLabels(label);
    setDifferenceData(difference);

  }

  // Handle search bar input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventId(Number(e.target.value));
  }

  const handleSearch = () => {
    if (eventId !== null) {
      getIntervalEventDetails(eventId)
        .then((eventData) => {        
          const event = eventData as EventData; // Cast the event to EventData
         setDataArray([event.processedData]);
         setColorArray([event.processedColors])
         setDifferenceData([event.difference]); 
         setLabels([event.label]); 
        })
        .catch(() => {
          console.log("Event not found!",);
          setEventId(null); 
          if (inputRef.current) {
            inputRef.current.value = ''; // Clear input field            
          }
          setReloadFlag(prevFlag => prevFlag + 1);
        });
    }
    else{
      console.log('No Event ID Entered');
      setEventId(null); 
      setReloadFlag(prevFlag => prevFlag + 1);

    }
  };

 return (
  <div className='container mt-2'>
      <HeaderComponent />
      <div className='search-container'>
        <input
          ref={inputRef}
          type="number"
          placeholder="Enter Event ID"
          onChange={handleInputChange}
          className="form-control mb-3"
        />
        <button onClick={handleSearch} className="btn btn-primary mb-3">Search</button>
      </div>
      <BatteryBarChartComponent 
          labels={labels} 
          difference={differenceData}
          dataArray={dataArray}
          colorArray={colorArray}
           />
  </div>
  
);
}

export default App
