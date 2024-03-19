import express from 'express'
import morgan from 'morgan'
import cors from  'cors'
import mongoose from 'mongoose'
import { DB_URL ,DB_DATABASE } from './config.js'
import rutasProductos from './Routes/Productos.routes.js'

mongoose.connect(DB_URL)
  .then(()=>{
    console.log("Connected to MongoDB");
  })
  .catch(()=>{
    console.log("Couldn't connect to MongoDB");
  })

const app=express()
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.static('public'))
app.use(rutasProductos)
app.get('/',(req,res)=>{
  res.send({"message":"Welcome to my rest-api"})
  
})


app.use((req,res)=>{
    res.status(404).json({status:false,errors:'Not found'})
})

export default app;