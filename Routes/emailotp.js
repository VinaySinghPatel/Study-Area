require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

let OTPstorage = {};

router.post('/sendotp',async (req,res) => {
        let Success = false;
        const {email} = req.body;
        let otp = Math.floor(100000 + Math.random() * 900000);
        OTPstorage[email] = otp;

        const transpoter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          }
        )

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Verify Your Account Using this OTP Bhai!! ${otp}`
          };

          try {
            await transpoter.sendMail(mailOptions);
            Success = true;
            res.status(200).json({Succes : Success, message: 'OTP sent successfully!' });
          } catch (error) {
            console.error('Error sending OTP:', error);
            res.status(500).json({ error: 'Error sending OTP' });
          }
});


router.post('/verifyOTP',async (req,res)=>{
    let Success = false;
    const {email,otp} = req.body;
    if(OTPstorage[email] == otp){
        delete OTPstorage[email];
        Success = true;
        res.status(200).json({Success : "Succesfully You Are Verified"});
    }
  });

module.exports  = router;