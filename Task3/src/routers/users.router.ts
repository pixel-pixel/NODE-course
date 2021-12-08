import { Router } from "express"
import usersController from "../controllers/users.controller"

const usersRouter = Router()

usersRouter.get('/me', usersController.getMe)
usersRouter.delete('/me', usersController.deleteMe)
usersRouter.patch('/me/password', usersController.patchMePassword)

export default usersRouter