require('dotenv').config()

const express = require('express');

const bodyParser = require('body-parser')

const db = require('./db')

const userRoute = require('./routes/userapi')

const cors = require('cors')


const app = express()

app.use(bodyParser.json())

app.use(cors())

app.use('/api/user',userRoute)
//http://localhost:3000/api/user/adduser

const port = process.env.PORT

app.get('/',(req,res)=>{
    res.send('Successfully..! Run this server')
})

app.listen(port,()=>{
    console.log(`Server is running on : http://localhost:${port}`)
    
})
 