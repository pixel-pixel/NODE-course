import { model, Schema } from "mongoose"
import { Truck } from "../common/types/Truck.type"
import { User } from "../common/types/User.type"

const truckShema = new Schema<Truck>({
    created_by: { type: String, required: true },
    assigned_to: { type: String },
    type: { type: String, required: true },
    status: { type: String, require: true },
    created_date: { type: String, require: true }
})

export default model<Truck>('Truck', truckShema)