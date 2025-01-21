require('dotenv').config()

const mongoose = require('mongoose')

const dburi = process.env.DB_URI

mongoose.connect(dburi)
// mongoose.connect('mongodb://localhost:27017/blog_mern')

mongoose.connection.on('connected',()=>{
    console.log('connected to MongoDB');
    
})

mongoose.connection.on('error',(err)=>{
    console.log('connection error:',err);
})

module.exports = mongoose