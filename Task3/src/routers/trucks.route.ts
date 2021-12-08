import { Router } from "express"
import trucksController from "../controllers/trucks.controller"

const trucksRouter = Router()

trucksRouter.get('/', trucksController.getUsersTrucks)
trucksRouter.post('/', trucksController.addUsersTruck)
trucksRouter.get('/:id', trucksController.getUsersTruckById)
trucksRouter.put('/:id', trucksController.editUsersTruckById)
trucksRouter.delete('/:id', trucksController.deleteUsersTruckById)
trucksRouter.post('/:id/assign', trucksController.asignTruckToUserById)

export default trucksRouter