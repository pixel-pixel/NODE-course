import { Router } from "express"
import Roles from "../common/enums/Roles.enum"
import loadsControllers from "../controllers/loads.controllers"
import authMiddleware from "../middlewares/auth.middleware"

const loadsRouter = Router()

loadsRouter.get('/', loadsControllers.getUserLoads)
loadsRouter.post('/', authMiddleware(Roles.Shipper) ,loadsControllers.addLoadForUser)
loadsRouter.get('/active', authMiddleware(Roles.Driver), loadsControllers.getUserActiveLoad)
loadsRouter.patch('/active/state', authMiddleware(Roles.Driver), loadsControllers.nextLoadState)
loadsRouter.get('/:id', loadsControllers.getUserLoadById)
loadsRouter.put('/:id', loadsControllers.updateUserLoadById)
loadsRouter.delete('/:id', authMiddleware(Roles.Shipper), loadsControllers.deleteUserLoadById)
loadsRouter.post('/:id/post', authMiddleware(Roles.Shipper), loadsControllers.postUserLoadById)
loadsRouter.get('/:id/shipping_info', authMiddleware(Roles.Shipper), loadsControllers.getUserLoadShippingInfoById)

export default loadsRouter