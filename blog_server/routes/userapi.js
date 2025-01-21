// const bcrypt = require('bcryptjs'); // It helps to encrypt any type of text (it make password encrypt that why,.. password can't show anywhere such as database)
const jwt = require('jsonwebtoken'); // JSON Web Token for authentication      {i have  install in terminal (npm install jsonwebtoken)}
const express = require('express');
const path = require('path');        //For file paths...       it help to upload any type of images/files
const multer = require('multer');  //For file uploads..      it help to enable to upload images..
const router = express.Router();

const User = require('../models/user');   //call user path from models folder
const { console } = require('inspector');

const SECRET_KEY = "wins"

const storage = multer.diskStorage({
    destination: './uploads/',
    filename:function(req,file, cb){       // cb -> callBreak
        cd(null,file,fieldname+"-"+Date.now()+".png");  // file name & location (where u r store file)
    }    
})

// Initialize multer
const upload = multer({
    storage:storage,
    limits:{fileSize:1000000}  //limit is 1MB (limit: you may be add or may not be {as you wise})
})

//create route (where your image is upload)
router.post('/uploadimage', upload.single('profile_pic'), (req,res)=>{
    res.json({'mes':"file uploaded successfully"})
})

//  (Add Data to DataBase)
router.post('/adduser', async (req, res) => {
    try {
        const newUser = new User({
            user_name: req.body.user_name,
            user_email: req.body.user_email, // Ensure this matches your schema
            // password: await bcrypt.hash(req.body.password,12),
            password:req.body.password,   //after use this line... (make sure above bcrypt method is disable/comment out)
            user_dob: req.body.user_dob, // Store the date directly
            gender: req.body.gender
            
        });
        const saveUser = await newUser.save();
        res.json(saveUser);
    } catch (error) {
        res.status(500).json({ error: error.message }); // Return error message for debugging
    }
});



//http://localhost:3000/api/user/userlogin
router.post('/userlogin',async(req, res)=>{
    const email = req.body.user_email
    const password = req.body.password
 
    try {
        const login = await User.findOne({user_email:email})
        if (!login) {
            return res.json({"sts":1,"msg":"Email not found"})
        }
        else{
             // bcrypt -> it help to compare "registration password" to "login password"
            // if (await bcrypt.compare(password, login.password)) {

                // Direct password comparison
                if (password === login.password) {
                const token = jwt.sign({userId:login._id},SECRET_KEY,{expiresIn:'1hr'})
                return res.json({"sts":0,"msg":"login success",token})
            }
            else{
                return res.json({"sts":2,"msg":"Invalid password"})
            }
        }
    } catch (error) {
        res.json({'error':error}) 
    }
})

// "await (operator)" -> it help to keep your state on hold so that your state does not move forward... (The await keyword is used 
// inside an async function to pause the execution of the function until the Promise is settled (resolved or rejected).)

// "async" -> it help when await process then async is help to process.... (The async keyword is used to define a 
// function as asynchronous. When a function is marked as async it means it will always return a promise)


// View all users
//http://localhost:3000/api/user/viewuser    (View all Data from database )
router.get('/viewuser',async(req, res)=>{
    try {
        const user = await User.find()
        res.json(user)
    } catch (error) {
        res.status(500).json({'error':error }) 
        
    }
})

// View single user by ID
//http://localhost:3000/api/user/singleuser/98072     (show data for any person from database)
router.get('/singleuser/:userid', async(req, res)=>{
    const uid = req.params.userid
    try {
        const user = await User.findById(uid)  // find user from it id number
        res.json(user)
    } catch (error) {
        res.status(500).json({'error':error}) 
        
    } 


})
//http://localhost:3000/api/user/updateuser/98072   (update data in Database)
router.put('/updateuser/:userid', async(req, res)=>{

    const uid = req.params.userid
    try {
        const user = await User.findByIdAndUpdate(
            uid,
            {$set:req.body},   // "$set" -> it help to change specific data from user data 
            {new:true}
        )
        res.json(user)
    } catch (error) {
        res.status(500).json({'error':error})
        
    }
})

//http://localhost:3000/api/user/deleteuser/98072   (Delete data in Database)
router.delete('/deleteuser/:userid', async (req, res) => {
    console.log('DELETE request received for user:', req.params.userid);
    const uid = req.params.userid;
    try {
        const user = await User.findByIdAndDelete(uid);
        res.status(200).json({ msg: 'User has been deleted successfully', sts: 'success' });
    } catch (error) {
        res.status(500).json({ error });
    }
});


module.exports = router;