import { Request, Response } from "express"
import Joi from "joi"
import TruckModel from "../models/Truck.model"
import createEditTruckSchema from "../common/schemas/createEditTruck.schema"
import getFormatedDate from "../tools/getFormatedDate.tool"

class TrucksController {
  async getUsersTrucks(req: Request, res: Response) {
    try {
      const { _id } = req['user']
      const trucks = await TruckModel.find({created_by: _id})
      return res.json({trucks})

    } catch (e) {
      const message = (e as Error).message
      res.status(400).json({message})
    }
  }

  async addUsersTruck(req: Request, res: Response) {
    try {
      const { _id: userId } = req['user']
      const { type, status = 'IS' } = Joi.attempt(req.body, createEditTruckSchema)

      const truck = new TruckModel({
        created_by: userId,
        type,
        status,
        created_date: getFormatedDate()
      })

      await truck.save()
      return res.json({message: 'Truck created successfully'})

    } catch (e) {
      const message = (e as Error).message
      res.status(400).json({message})
    }
  }

  async getUsersTruckById(req: Request, res: Response) {
    try {
      const { _id } = req['user']
      const truck = await TruckModel.findById(req.params.id)
      if (truck.created_by != _id) throw Error('you don`t have permissions')
      return res.json({truck})

    } catch (e) {
      const message = (e as Error).message
      res.status(400).json({message})
    }
  }

  async editUsersTruckById(req: Request, res: Response) {
    try {
      const { _id: userId } = req['user']
      const { id: truckId } = req.params
      const { type, status = 'OL' } = Joi.attempt(req.body, createEditTruckSchema)

      const truck = await TruckModel.findById(truckId)
      if (truck.created_by != userId) throw Error('you don`t have permissions')

      truck.type = type
      truck.status = status
      await truck.save()
      return res.json({message: 'Truck assigned successfully'})

    } catch (e) {
      const message = (e as Error).message
      res.status(400).json({message})
    }
  }

  async deleteUsersTruckById(req: Request, res: Response) {
    try {
      const { _id: userId } = req['user']
      const { id: trackId } = req.params
  
      const truck = await TruckModel.findById(trackId)
      if (truck.created_by != userId) throw Error('you don`t have permissions')
  
      await truck.delete()
      return res.json({message: 'Truck deleted successfully'})

    } catch (e) {
      const message = (e as Error).message
      res.status(400).json({message})
    }
  }

  async asignTruckToUserById(req: Request, res: Response) {
    try {
      const { _id: userId } = req['user']
      const { id: trackId } = req.params
      const assignedTrucks = await TruckModel.find({assigned_to: userId})
      if (assignedTrucks.length > 0) throw Error('you already assigned to another truck')

      const truck = await TruckModel.findById(trackId)

      truck.assigned_to = userId
      await truck.save()

      return res.json({message: 'Truck assigned successfully'})

    } catch (e) {
      const message = (e as Error).message
      res.status(400).json({message})
    }
  }
}

export default new TrucksController