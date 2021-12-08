import Roles from "../common/enums/Roles.enum";
import jwt from "jsonwebtoken"
import * as dotenv from "dotenv"
import { TokenData } from "src/common/types/TokenData.type";

dotenv.config()

const generateToken = (id: string, role: Roles) => {
  const payload: TokenData = {id, role}
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: '24h'})
}

export default generateToken