import Joi from "joi"

const patchPasswordSchema = Joi.object({
  oldPassword: Joi.string().min(8).required(),
  newPassword: Joi.string().min(8).required(),
})

export default patchPasswordSchema