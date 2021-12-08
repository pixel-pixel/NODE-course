import Joi, { number, object, string } from "joi";

const addLoadForUserSchema = Joi.object({
  name: Joi.string().required(),
  payload: Joi.number().required(),
  pickup_address: Joi.string().required(),
  delivery_address: Joi.string().required(),
  dimensions: Joi.object({
    width: Joi.number().required(),
    length: Joi.number().required(),
    height: Joi.number().required()
  }).required()
})

export default addLoadForUserSchema