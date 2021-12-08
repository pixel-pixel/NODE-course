import { Request, Response } from "express"
import UserModel from "../models/User.model"
import RoleModel from "../models/role.model"
import bcrypt from 'bcryptjs'
import Joi from "joi"
import registerSchema from "../common/schemas/register.schema"
import loginSchema from "../common/schemas/login.schema"
import generateToken from "../tools/token.tool"

class AuthController {
    async register(req: Request, res: Response) {
        try {
            const body = Joi.attempt(req.body, registerSchema, 'invalid method`s body')
            const { email, password, role: value } = body
            const user = await UserModel.findOne({email})
            const role = await RoleModel.findOne({value})
            if (user) throw Error('user with this email already exist')
            if (!role) throw Error('invalid role')

            const hashPassword = bcrypt.hashSync(password, 7)
            const newUser = new UserModel({
                email,
                password: hashPassword,
                role: value
            })
            await newUser.save()

            return res.json({message: "Profile created successfully"})
        } catch (e) {
            const message = (e as Error).message
            res.status(400).json({message})
        }
    }

    async login(req: Request, res: Response) {
        try {
            const body = Joi.attempt(req.body, loginSchema)
            const { email, password } = body
            const user = await UserModel.findOne({email})
            if(!user) throw Error('user with this email don`t exist')

            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) throw Error('bad password')

            const jwt_token = generateToken(user._id, user.role)
            res.json({jwt_token})
        } catch (e) {
            const message = (e as Error).message
            res.status(400).json({message})
        }
    }
}

export default new AuthController