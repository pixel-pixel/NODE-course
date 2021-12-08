import express from "express"
import mongoose, {ConnectOptions} from "mongoose"
import * as dotenv from "dotenv"
import authRouter from "./routers/auth.router"
import usersRouter from "./routers/users.router"
import authMiddleware from "./middlewares/auth.middleware"
import Roles from "./common/enums/Roles.enum"
import trucksRouter from "./routers/trucks.route"
import loadsRouter from "./routers/losds.router"
import morgan from "morgan"

dotenv.config()
const app = express()
const PORT = process.env.PORT || 8080

app.use(express.json())
app.use(morgan('tiny'))
app.use('/api/auth', authRouter)
app.use('/api/users', authMiddleware(), usersRouter)
app.use('/api/trucks', authMiddleware(Roles.Driver), trucksRouter)
app.use('/api/loads', authMiddleware(), loadsRouter)

app.listen(PORT, async () => {
    await mongoose.connect(process.env.MONGO_ATLAS_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    console.log('Server is working...')
})
