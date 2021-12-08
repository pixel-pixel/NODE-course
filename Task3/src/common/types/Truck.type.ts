import TruckStatus from "../enums/TruckStatus.enum";
import TruckTypes from "../enums/TruckTypes.enum";

type Truck = {
  created_by: string
  assigned_to: string | null
  type: TruckTypes
  status: TruckStatus
  created_date: string
}

export { Truck }