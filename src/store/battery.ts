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
      chargingData: 0,
      consumingData: 0,
      noChangeData: 0,
      difference: 0,
    };
    const index = data.chargingStates.findIndex(event => event.internalEventId === id);
    console.log('index',index)
    if (index === -1) {
      reject(new Error("Event not found"));  //  event is not found
      return;
    }
    else if(index === 0){
      if(data.chargingStates[index].chargingLevel < data.chargingStates[1].chargingLevel)  //charging
      {
          eventData.consumingData = 0;
          eventData.noChangeData = 0;
          eventData.chargingData = data.chargingStates[index].chargingLevel
          eventData.label = new Date(data.chargingStates[index].date).toLocaleString()
          eventData.difference = 0

      }
      else if(data.chargingStates[index].chargingLevel > data.chargingStates[1].chargingLevel)  //consuming
      {
          eventData.chargingData = 0;
          eventData.noChangeData = 0;
          eventData.consumingData = data.chargingStates[index].chargingLevel
          eventData.label = new Date(data.chargingStates[index].date).toLocaleString()
          eventData.difference = 0
      }
      else //no change
      {
        eventData.chargingData = 0;
        eventData.consumingData = 0;
        eventData.noChangeData = data.chargingStates[index].chargingLevel
        eventData.label = new Date(data.chargingStates[index].date).toLocaleString()
        eventData.difference = 0

      }
    }
    else {
      if(data.chargingStates[index].chargingLevel > data.chargingStates[index-1].chargingLevel)  //charging
      {
          eventData.consumingData = 0;
          eventData.noChangeData = 0;
          eventData.chargingData = data.chargingStates[index].chargingLevel
          eventData.label = new Date(data.chargingStates[index].date).toLocaleString()
          eventData.difference = data.chargingStates[index].chargingLevel - data.chargingStates[index-1].chargingLevel

      }
      else if(data.chargingStates[index].chargingLevel < data.chargingStates[index-1].chargingLevel)  //consuming
      {
          eventData.chargingData = 0;
          eventData.noChangeData = 0;
          eventData.consumingData = data.chargingStates[index].chargingLevel
          eventData.label = new Date(data.chargingStates[index].date).toLocaleString()
          eventData.difference = data.chargingStates[index].chargingLevel - data.chargingStates[index-1].chargingLevel
      }
      else //no change
      {
        eventData.chargingData = 0;
        eventData.consumingData = 0;
        eventData.noChangeData = data.chargingStates[index].chargingLevel
        eventData.label = new Date(data.chargingStates[index].date).toLocaleString()
        eventData.difference = data.chargingStates[index].chargingLevel - data.chargingStates[index-1].chargingLevel

      }
    }
    resolve(eventData); 
   });
 };