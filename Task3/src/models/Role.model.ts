import { model, Schema } from "mongoose"

const roleShema = new Schema({
    value: { type: String, required: true, default: 'USER' }
})

export default model('Role', roleShema)