import { model, Schema } from "mongoose"
import { User } from "src/common/types/User.type"

const userShema = new Schema<User>({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true }
})

export default model<User>('User', userShema)