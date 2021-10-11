import express from "express"
import { FileModel } from "../models/Files.model"

import { createFileSchema } from "../common/schemes/CreateFile.schema"

export async function createFile(req: express.Request, res: express.Response) {
  try {
    await createFileSchema.validate(req.body)

    const { filename, content } = req.body
    
    FileModel.create(filename, content)
    res.status(200).send({"message": "File created successfully"}) 
  } catch (e) {
    res.status(400).send({"message": (e as Error).message})
  }
}

export function getAllFiles(req: express.Request, res: express.Response) {
  try {
    const files = FileModel.getAll()
    res.status(200).send({
        "message": "Success",
        "files": files
    })
  } catch (e) {
    res.status(400).send({
        "message": (e as Error).message
    })
  } 
}

export function getFileByName(req: express.Request, res: express.Response) {
  try {
    const json = FileModel.getByName(req.params.filename)
    res.status(200).send({"message": "Success", ...json})
  } catch (e) {
    res.status(400).send({
      "message": (e as Error).message
    })
  }
}