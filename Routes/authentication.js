const express = require('express');
const User = require('../Model/User');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwt_Token = 'VinaySinghPatel';

router.post('/createac',[
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password 8 Character ka Hona Chaiye.')
], async (req,res) => {
    let Success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({Success, errors: errors.array() });
    }
    const existingUsername = await User.findOne({ username: req.body.username });
    if (existingUsername) {
        return res.status(400).json({ error: "Username is already taken., PLease enter a unique  Username" }
        );
    }
    try {
        let user = await User.findOne({email : req.body.email});
    if(user){
        res.status(400).json({Success,error: "Ye User Pehle Se HAi Sorry "});
    }
   
    const salt = await bcrypt.genSaltSync(10);
    const SecPass = await bcrypt.hash(req.body.password,salt);
     user = await User.create({
        username : req.body.username,
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        mobilenumber : req.body.mobilenumber
    })
        const data = {
            user : {
                id : user.id
            }
        }
        const AuthenticationData = jwt.sign(data,jwt_Token);
        const dataa = await user.id;
        Success = true;
        res.json({Success,AuthenticationData,dataa});
    } catch (error) {
        console.log("Error While Creating the New User",error.message);
        res.status(400).json("There is an Error Occured while User Creation");
    }
});


router.post('/Login',[
    body('email').isEmail().withMessage('Not a valid email address'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  ],async (req,res)=>{
      let Succes = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ Succes, errors: errors.array() });
    }
    const {email,password} = req.body;
    try {
    const user = await User.findOne({email});
      if(!user){
          return res.status(401).json({Succes,error : "Ye Gmail galat hai"});
      }
  
   // const PassCompare = await bcrypt.compare(password,user.password);
    const PassCompare = await user.password;
    if(!PassCompare){
      return res.status(401).json({error:"The Pass is Not Correct"});
    }
  
    const UserId = {
     user :  {
      id : user.id
    }}
  
      // Yaha per sign kr rahe kyu ham crediatial se login kar rahe hai 
    const Authtoken = await jwt.sign(UserId,jwt_Token);
    const dataa = await user.id;
    Succes = true;
    res.json({Succes : "Succesfully Login",Authtoken,dataa})
  } catch (error) {
    console.error(error.message);
    console.log("There is an error in Email Pass Login ");
  }
   
  })
  
  
  router.get('/GetUserData/:id', async (req, res) => {
    try {
      const userId = req.params.id;
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;