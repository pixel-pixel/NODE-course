const express = require("express")

const app = express()
const PORT = 8080

app.get('/', (req, res) => {
    res.send('kek')
})

app.listen(PORT, () => {
    console.log('server is working')
})