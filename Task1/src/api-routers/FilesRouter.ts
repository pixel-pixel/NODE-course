import { Router } from "express";
import { Endpoint } from "../common/enums/Endpoint.enum";
import * as FilesService from "../services/Files.service"

const filesRouter = Router()

filesRouter.post(Endpoint.ROOT, FilesService.createFile)

filesRouter.get(Endpoint.ROOT, FilesService.getAllFiles)

filesRouter.get(Endpoint.FILENAME, FilesService.getFileByName)

export default filesRouter