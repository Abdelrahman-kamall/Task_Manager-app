const express = require("express")
require("./db/mongoose")
const userRouter = require('./routesrs/userRouter')
const taskRouter = require('./routesrs/taskRouter')

const app = express()
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

const port = process.env.PORT 
app.listen(port , ()=>{
    console.log("server is up , started from port "+ port )
})