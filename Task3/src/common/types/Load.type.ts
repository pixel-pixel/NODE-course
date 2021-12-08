import LoadState from "../enums/LoadState.enum";
import LoadStatus from "../enums/LoadStatus.enum";

export type Load = {
  _id: string
  created_by: string
  assigned_to: string
  status: LoadStatus
  state: LoadState
  name: string
  payload: number
  pickup_address: string
  delivery_address: string
  dimensions: {
    width: number
    length: number
    height: number
  }  
  logs: {
    message: string
    time: string
  }[]
  created_date: string
}
