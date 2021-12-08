import Joi, { string } from "joi"
import { model, Schema } from "mongoose"
import LoadState from "../common/enums/LoadState.enum"
import LoadStatus from "../common/enums/LoadStatus.enum"
import { Load } from "../common/types/Load.type"

const loadShema = new Schema<Load>({
  created_by: {type: String, require: true},
  assigned_to: {type: String },
  status: {type: String, enum: [
    LoadStatus.NEW, 
    LoadStatus.POSTED, 
    LoadStatus.ASSIGNED, 
    LoadStatus.SHIPPED
  ], default: 'NEW'},
  state: {type: LoadState, default: null},
  name: {type: String, require: true},
  payload: {type: Number, require: true},
  pickup_address: {type: String, require: true},
  delivery_address: {type: String, require: true},
  dimensions: Joi.object({
    width: string,
    length: string,
    height: string
  }).required(),
  logs: {type: Object},
  created_date: {type: String}
})

export default model<Load>('Load', loadShema)