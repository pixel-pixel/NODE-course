import express from "express"
import morgan from "morgan"

import filesRouter from './api-routers/FilesRouter'
import { Endpoint } from './common/enums/Endpoint.enum'

const app = express()
const PORT = 8080

app.use(express.json())
app.use(morgan('tiny'))
app.use(Endpoint.API, filesRouter)

app.listen(PORT, () => console.log('Server is working now...'))