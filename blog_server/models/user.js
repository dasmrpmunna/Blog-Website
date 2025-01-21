const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    user_name:{
        type: String,
        required:true,
    },

    user_email:{ type: String, required:true, },

    password:{ type: String, required:true, },

    user_dob:{ type:Date, required:true, },

    user_gender:{type: String, enum:['Male','Female'], default:'Male'}
    
    

})

module.exports = mongoose.model('mbs_user',userSchema) //mbs -> micro-blogging system