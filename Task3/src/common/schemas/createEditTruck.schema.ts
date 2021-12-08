import Joi, { string } from "joi";
import TruckStatus from "../enums/TruckStatus.enum";
import TruckTypes from "../enums/TruckTypes.enum";

const sreateEditTruckSchema = Joi.object({
  type: Joi.string().valid(
    TruckTypes.SPRINTER, 
    TruckTypes.SMALL_STRAIGHT, 
    TruckTypes.LARGE_STRAIGHT
  ).required(),
  status: Joi.string().valid(
    TruckStatus.OL, TruckStatus.IS
  )
})

export default sreateEditTruckSchema