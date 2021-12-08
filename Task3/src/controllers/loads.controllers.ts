import { Request, Response } from "express"
import Joi from "joi"
import LoadStatus from "../common/enums/LoadStatus.enum"
import TruckStatus from "../common/enums/TruckStatus.enum"
import TruckModel from "../models/Truck.model"
import Roles from "../common/enums/Roles.enum"
import addLoadForUserSchema from "../common/schemas/addLoadForUser.shema"
import { User } from "../common/types/User.type"
import LoadModel from "../models/Load.model"
import { getSizes } from "../common/enums/TruckTypes.enum"
import getFormatedDateTool from "../tools/getFormatedDate.tool"
import LoadState from "../common/enums/LoadState.enum"

class LoadsController {
  async getUserLoads(req: Request, res: Response) {
    try {
      const { _id: userId, role: userRole } = req['user'] as User
      if (userRole == Roles.Shipper) {
        const loads = await LoadModel.find({created_by: userId})
        res.json({loads})
      } else {
        const truck = await TruckModel.findOne({assigned_to: userId})
        if (!truck || truck.status === TruckStatus.IS) return res.json({loads: []})

        const loads = await LoadModel.find({assigned_to: truck._id})
        return res.json({loads})
      }
    } catch (e) {
      const message = (e as Error).message
      res.status(400).json({message})
    }
  }

  async addLoadForUser(req: Request, res: Response) {
    try {
      const body = Joi.attempt(req.body, addLoadForUserSchema)
      const { _id: userId } = req['user']

      const load = new LoadModel({
        ...body,
        created_by: userId,
        created_date: getFormatedDateTool()
      })
      await load.save()

      return res.json({message: 'Load created successfully'})

    } catch (e) {
      const message = (e as Error).message
      res.status(400).json({message})
    }
  }

  async getUserActiveLoad(req: Request, res: Response) {
    try {
      const { _id: userId } = req['user'] as User
      const truck = await TruckModel.findOne({assigned_to: userId})
      if (!truck || truck.status == TruckStatus.IS) return res.json({load: null})
  
      const load = await LoadModel.findOne({assigned_to: truck._id})
      return res.json({load})
    } catch (e) {
      const message = (e as Error).message
      res.status(400).json({message})
    }
  }

  async nextLoadState(req: Request, res: Response) {
    try {
      const { _id: userId } = req['user'] as User
      const truck = await TruckModel.findOne({assigned_to: userId})
      if (!truck) throw Error('you don`t assign to truck')

      const load = await LoadModel.findOne({assigned_to: truck._id})
      if (!load) throw Error('truck don`t assign to load')

      switch(load.state) {
        case LoadState.ROUTE_TO_PICK_UP:
          load.state = LoadState.ARIVED_TO_PICK_UP
          break
        case LoadState.ARIVED_TO_PICK_UP:
          load.state = LoadState.ROUTE_TO_DELIVERY
          break
        default:
          load.state = LoadState.ARIVED_TO_DELIVERY
          load.status = LoadStatus.SHIPPED
          truck.status = TruckStatus.IS
          await truck.save()
      }
      await load.save()
      return res.json({message: `Load state changed to '${load.state}'`})
    } catch (e) {
      const message = (e as Error).message
      res.status(400).json({message})
    }
  }

  async getUserLoadById(req: Request, res: Response) {
    try {
      const { _id: userId } = req['user'] as User
      const { id: loadId } = req.params
      const load = await LoadModel.findById(loadId)
      const { _id: truckId} = await TruckModel.findOne({assigned_to: userId})

      console.log(userId + ' ' + load.assigned_to + ' ' + load.created_by)

      if (load.assigned_to != truckId && load.created_by != userId) {
        throw Error('you don`t have permissions')
      }
      return res.json({load})

    } catch (e) {
      const message = (e as Error).message
      res.status(400).json({message})
    }
  }

  async updateUserLoadById(req: Request, res: Response) {
    try {
      const body = Joi.attempt(req.body, addLoadForUserSchema)
      const { _id: userId } = req['user'] as User
      const { id: loadId } = req.params 
      let load = await LoadModel.findById(loadId)
      if (load.created_by != userId) throw Error('you don`t have permissin')

      load = Object.assign(load, body)
      load.save()
      return res.json({message: 'Load details changed successfully'})
    } catch (e) {
      const message = (e as Error).message
      res.status(400).json({message})
    }
  }

  async deleteUserLoadById(req: Request, res: Response) {
    try {
      const { _id: userId } = req['user'] as User
      const { id: loadId } = req.params
      const load = await LoadModel.findById(loadId)
      if (load.created_by != userId) throw Error('you don`t have permissions')

      await load.delete()
      return res.json({message: 'Load deleted successfully'})
    } catch (e) {
      const message = (e as Error).message
      res.status(400).json({message})
    }
  }

  async postUserLoadById(req: Request, res: Response) {
    try {
      const { _id: userId } = req['user'] as User
      const loadId = req.params.id
      const load = await LoadModel.findById(loadId)
      if (load.created_by != userId) throw Error('you don`t have permissions')

      load.status = LoadStatus.POSTED
      await load.save()

      const trucks = await TruckModel.find()
        .where('status').equals(TruckStatus.IS)
        .where('assigned_to').ne(null)

      const findedTruck = trucks.find(t => {
        const sizes = getSizes(t.type)

        return sizes.payload >= load.payload &&
          sizes.width >= load.dimensions.width &&
          sizes.length >= load.dimensions.length &&
          sizes.height >= load.dimensions.height
      })
      if (findedTruck) {
        findedTruck.status = TruckStatus.OL
        await findedTruck.save()

        load.status = LoadStatus.ASSIGNED
        load.assigned_to = findedTruck._id
        load.state = LoadState.ROUTE_TO_PICK_UP
        load.logs = load.logs ?? []
        load.logs.push({
          message: `truck found, id: ${findedTruck._id}`,
          time: getFormatedDateTool()
        })
        await load.save()

        return res.json({
          message: 'Load posted successfully',
          driver_found: true
        })
      } else {
        load.logs = load.logs ?? []
        load.logs.push({
          message: 'truck not found',
          time: getFormatedDateTool()
        })
        await load.save()

        return res.json({
          message: 'Load can`t be posted. Driver not found',
          driver_found: false
        })
      }

    } catch (e) {
      const message = (e as Error).message
      res.status(400).json({message})
    }
  }

  async getUserLoadShippingInfoById(req: Request, res: Response) {
    try {
      const { _id: userId } = req['user'] as User
      const { id: loadId } = req.params
      const load = await LoadModel.findById(loadId)
      if (load.created_by != userId) throw Error('you don`t have permission')

      const truck = await TruckModel.findById(load.assigned_to)
      return res.json({load, truck})
    } catch (e) {
      const message = (e as Error).message
      res.status(400).json({message})
    }
  }
}

export default new LoadsController