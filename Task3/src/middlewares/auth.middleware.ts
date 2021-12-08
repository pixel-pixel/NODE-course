import { Request, Response, NextFunction } from "express"
import * as dotenv from "dotenv"
import * as jwt from "jsonwebtoken"
import UserModel from "../models/User.model"
import { TokenData } from "src/common/types/TokenData.type"
import Roles from "src/common/enums/Roles.enum";


dotenv.config()

const authMiddleware = (role: Roles | null = null) => 
async(req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'OPTIONS') next()

  try {
    const arr = req.headers.authorization?.split(' ')
    if(!arr) throw Error('authorization error')

    const token = arr[arr.length - 1]
    const tokenData = jwt.verify(token, process.env.JWT_SECRET_KEY) as TokenData
    if(!tokenData) throw Error('authorization error')

    const user = await UserModel.findOne({_id: tokenData.id})
    if(!user) throw Error('user doesn`t exist')

    console.log(role && user.role != role)
    if (role && user.role != role) throw Error('you don`t have permisions')

    req['user'] = user
    next()

  } catch (e) {
    const message = (e as Error).message
    res.status(400).json({message})
  }
}

export default authMiddleware