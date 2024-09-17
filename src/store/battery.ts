import data from './backend-response.json';

export const fetchBatteryData = () => {
   return new Promise((resolve) => {
     setTimeout(() => {
       resolve(data as BatteryDataResponse);
     }, 1000);
   });
 };

 export const getIntervalEventDetails = async (id : number) => {
   return new Promise((resolve, reject) => {
  
    const eventData : EventData = {
      label: '', 
      difference: 0,
      processedData:0,
      processedColors:''
    };
    const index = data.chargingStates.findIndex(event => event.internalEventId === id);
    if (index === -1) {
      reject(new Error("Event not found"));  //  event is not found
      return;
    }
    else if(index === 0){
      if(data.chargingStates[index].chargingLevel < data.chargingStates[1].chargingLevel)  //charging
      {
          eventData.processedData = data.chargingStates[index].chargingLevel
          eventData.processedColors = ('rgba(44, 137, 30, 0.4)'); // Green for charging
          eventData.label = new Date(data.chargingStates[index].date).toLocaleString()
          eventData.difference = 0

      }
      else if(data.chargingStates[index].chargingLevel > data.chargingStates[1].chargingLevel)  //consuming
      {
          eventData.processedData = data.chargingStates[index].chargingLevel
          eventData.processedColors = ('rgba(255, 10, 10, 0.6)'); // Red for consuming
          eventData.label = new Date(data.chargingStates[index].date).toLocaleString()
          eventData.difference = 0
      }
      else //no change
      {
        eventData.processedData = data.chargingStates[index].chargingLevel
        eventData.processedColors = ('rgba(51, 49, 49, 0.6)'); // Gray for no change
        eventData.label = new Date(data.chargingStates[index].date).toLocaleString()
        eventData.difference = 0

      }
    }
    else {
      if(data.chargingStates[index].chargingLevel > data.chargingStates[index-1].chargingLevel)  //charging
      {
          eventData.processedData = data.chargingStates[index].chargingLevel
          eventData.label = new Date(data.chargingStates[index].date).toLocaleString()
          eventData.processedColors = ('rgba(44, 137, 30, 0.4)'); // Green for charging
          eventData.difference = data.chargingStates[index].chargingLevel - data.chargingStates[index-1].chargingLevel

      }
      else if(data.chargingStates[index].chargingLevel < data.chargingStates[index-1].chargingLevel)  //consuming
      {
          eventData.processedData = data.chargingStates[index].chargingLevel
          eventData.processedColors = ('rgba(255, 10, 10, 0.6)'); // Red for consuming
          eventData.label = new Date(data.chargingStates[index].date).toLocaleString()
          eventData.difference = data.chargingStates[index].chargingLevel - data.chargingStates[index-1].chargingLevel
      }
      else //no change
      {
        eventData.processedData = data.chargingStates[index].chargingLevel
        eventData.label = new Date(data.chargingStates[index].date).toLocaleString()
        eventData.processedColors = ('rgba(51, 49, 49, 0.6)'); // Gray for no change
        eventData.difference = data.chargingStates[index].chargingLevel - data.chargingStates[index-1].chargingLevel

      }
    }
    resolve(eventData as EventData); 
   });
 };