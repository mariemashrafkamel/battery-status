
 interface BatteryBarChartProps {
   labels: string[]; //dates to be displayed on x axis
   chargingData: number[];
   consumingData: number[];
   noChangeData: number[];
   difference: number[];
 }

 interface BatteryData {
  chargingLevel: number
  date :string;
  internalEventId : number
 }

 interface BatteryDataResponse {
  chargingStates: BatteryData[];
}

interface EventData {
  chargingLevel?: number
  date? :string;
  internalEventId? : number;
  label: string; 
  chargingData: number;
  consumingData: number;
  noChangeData: number;
  difference: number;
}