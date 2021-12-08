import Joi from "joi";
import Roles from "../enums/Roles.enum";

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid(Roles.Driver, Roles.Shipper).required()
})

export default registerSchema