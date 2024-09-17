 type LegendType = 'Charging' | 'Consuming' | 'NoChange'; //possible legend(label tags) types
 interface BatteryBarChartProps {
   labels: string[]; //dates to be displayed on x axis
   difference: number[];
   dataArray: number[];
   colorArray: string[];
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
  difference: number;
  processedColors:string;
  processedData:number;
}

// Interface for the legend(label tag) visibility state
interface LegendVisibility {
  Charging: boolean;
  Consuming: boolean;
  NoChange: boolean;
}