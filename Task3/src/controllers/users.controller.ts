import { Request, Response } from "express"
import { TokenData } from "../common/types/TokenData.type"
import { User } from "../common/types/User.type"
import UserModel from "../models/User.model"
import Joi from "joi"
import patchPassword from "../common/schemas/patchPassword.schema"
import bcrypt from "bcryptjs"

class UsersController {
  async getMe(req: Request, res: Response) {
    try {
      const user = req['user'] as User
      res.json({user})

    } catch (e) {
      const message = (e as Error).message
      res.status(400).json({message})
    }
  }
  
  async deleteMe(req: Request, res: Response) {
    try {
      const { _id } = req['user'] as User
      await UserModel.deleteOne({_id})
      res.json({message: 'Profile deleted successfully'})

    } catch (e) {
      const message = (e as Error).message
      res.status(400).json({message})
    }
  }

  async patchMePassword(req: Request, res: Response) {
    try {
      const { oldPassword, newPassword } = Joi.attempt(req.body, patchPassword)
      const { _id, password } = req['user'] as User

      const validPassword = bcrypt.compareSync(oldPassword, password)
      if (!validPassword) throw Error('bad password')

      const cryptedPassword = bcrypt.hashSync(newPassword, 7)
      await UserModel.updateOne({_id}, {password: cryptedPassword})
      res.json({ message: 'Password changed successfully'})
      
    } catch (e) {
      const message = (e as Error).message
      res.status(400).json({message})
    }
  }
}

export default new UsersController