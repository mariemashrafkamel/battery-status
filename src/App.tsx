import React, { useEffect, useRef, useState } from 'react';
import HeaderComponent from './Components/HeaderComponent';
import BatteryBarChartComponent from "./Components/BatteryBarChartComponent"
import { fetchBatteryData, getIntervalEventDetails } from './store/battery';

const App : React.FC = () => {
  const [batteryData, setBatteryData] = useState<BatteryDataResponse | null>(null)
  const [chargingData, setChargingData] = useState<number[]>([]);
  const [consumingData, setConsumingData] = useState<number[]>([]);
  const [noChangeData, setNoChangeData] = useState<number[]>([]);
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
    const charging = [];
    const consuming = [];
    const noChange = [];
    const difference = [];
    const label = [];
    const data = batteryData.chargingStates
      if(data[0].chargingLevel < data[1].chargingLevel)  //charging
      {
          consuming.push(0);
          noChange.push(0);
          charging.push(data[0].chargingLevel)
          label.push(new Date(data[0].date).toLocaleString())  //to convert given date format to user time format
          difference.push(0)

      }
      else if(data[0].chargingLevel > data[1].chargingLevel)  //consuming
      {
        charging.push(0);
        noChange.push(0);
        consuming.push(data[0].chargingLevel)
        label.push(new Date(data[0].date).toLocaleString())
        difference.push(0)
      }
      else //no change
      {
        noChange.push(data[0].chargingLevel)
        charging.push(0);
        consuming.push(0);
        label.push(new Date(data[0].date).toLocaleString())
        difference.push(0)
      }
    
    for(let i = 1 ; i<data.length ; i++){
      if(data[i].chargingLevel > data[i-1].chargingLevel)  //charging
      {
          consuming.push(0);
          noChange.push(0);
          charging.push(data[i].chargingLevel)
          label.push(new Date(data[i].date).toLocaleString())
          difference.push(data[i].chargingLevel - data[i-1].chargingLevel)

      }
      else if(data[i].chargingLevel < data[i-1].chargingLevel)  //consuming
      {
        charging.push(0);
        noChange.push(0);
        consuming.push(data[i].chargingLevel)
        label.push(new Date(data[i].date).toLocaleString())
        difference.push(data[i].chargingLevel - data[i-1].chargingLevel)

      }
      else //no change
      {
        noChange.push(data[i].chargingLevel)
        charging.push(0);
        consuming.push(0);
        label.push(new Date(data[i].date).toLocaleString())
        difference.push(data[i].chargingLevel - data[i-1].chargingLevel)

      }
    }
    setChargingData(charging);
    setConsumingData(consuming);
    setNoChangeData(noChange);
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
        .then((event) => {          
         setChargingData([event.chargingData]); 
         setNoChangeData([event.noChangeData]); 
         setConsumingData([event.consumingData]); 
         setDifferenceData([event.difference]); 
         setLabels(event.label); 
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
          chargingData={chargingData} 
          consumingData={consumingData} 
          noChangeData={noChangeData} 
          labels={labels} 
          difference={differenceData} />
  </div>
  
);
}

export default App
