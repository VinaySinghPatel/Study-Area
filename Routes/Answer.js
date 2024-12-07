const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Answer = require('../Model/Ans');
const FetchUser = require('../MiddleWare/UserAuth');

router.post('/answer/:id',[
    FetchUser,
    body('answer').notEmpty().withMessage('Please Enter Your Answer')
],async (req,res) => {
    let Success = false;
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({Success, errors: errors.array() });
    }
    try {
    const {answer} = req.body;
    const {id} = req.params;
    const newAnswer = new Answer({
        questionId : id,
        answer,
        userId: req.user.id,
        name : req.user.name
    })
    await newAnswer.save();
    Success = true;
    res.status(200).json({ Success ,answer : newAnswer});
    } catch (error) {
        console.log("Error is ",error);
        res.status(500).json("Something Happen in While Creating Answer for Particular question");
    }
});


router.get('/GetAllAnswer/:id', async (req,res) => {
    try {
        const { id } = req.params;
        const answer = await Answer.find({questionId : id}).populate('userId', 'name email');
        if (!answer || answer.length === 0) {
            return res.status(404).json({ error: 'No answers found for this question.' });
          }
        res.status(200).json(answer);
    } catch (error) {
        console.log(error, "this is the error");
     res.status(500).json("there is an error in Get-All-Answer Sysytem");
    }
})

router.put("/updateAnswer/:id", FetchUser , async (req, res) => {
    try {
        let Success = false;
        const { answer } = req.body;
        const Ans = await Answer.findById(req.params.id);
        if (!Ans) {
            return res.status(404).json("Answer not found");
        }
        if(Ans.userId.toString() !== req.user.id){
            return  res.status(401).send("Not Allowed For You");
        }
        // if (!post.userId || post.userId.toString() !== req.user.id) {
        //     console.log("req.user.id:", req.user.id);
        //     return res.status(403).json("Unauthorized to update this post");
        // }
        let NewAnswer = {};
        if (answer){ NewAnswer.answer = answer};
        const updatedPost = await Answer.findByIdAndUpdate(req.params.id, { $set: NewAnswer }, { new: true });
        Success = true;
        res.json({Success,updatedPost});
    } catch (error) {
        console.error("Error updating post:", error.message);
        res.status(500).send("There is an error in the update post API");
    }
});

router.delete("/DeleteAnswer/:id", FetchUser , async (req, res) => {
    try {
        let Success = false;
        const { answer } = req.body;
        const Ans = await Answer.findById(req.params.id);
        if (!Ans) {
            return res.status(404).json("Answer not found");
        }
        if(Ans.userId.toString() !== req.user.id){
            return  res.status(401).send("Not Allowed For You");
        }
        // if (!post.userId || post.userId.toString() !== req.user.id) {
        //     console.log("req.user.id:", req.user.id);
        //     return res.status(403).json("Unauthorized to update this post");
        // }
        const DeletePost = await Answer.findByIdAndDelete(req.params.id);
        Success = true;
        res.json({Success,DeletePost});
    } catch (error) {
        console.error("Error updating post:", error.message);
        res.status(500).send("There is an error in the update post API");
    }
});

module.exports  = router;
