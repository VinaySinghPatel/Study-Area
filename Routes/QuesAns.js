const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const QuesAns = require('../Model/QuesAns');
const fecthUser = require('../MiddleWare/UserAuth');
const jwt_secret = "VinaySinghPatel"; 

router.post('/createQuesAns', fecthUser, [
    body('question').notEmpty().withMessage('Enter Your Question'),
    body('categeory').notEmpty().withMessage('Categeory of your question answer')
], async (req, res) => {
    let Success = false;
    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ Success, errors: error.array() });
        }

        const { question,categeory,answer } = req.body;
        const newQuesAns = new QuesAns({
            question,
            categeory,
            userId: req.user.id,
            user: req.user.id,
        });

        let saveQuesAns = await newQuesAns.save();
        Success = true;
        res.json(saveQuesAns);
    } catch (error) {
        console.error("Error creating QuesAns:", error.message);
        res.status(500).send("Some error occurred while creating the QuesAns");
    }
});



router.get('/getallpostUser/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "User ID is required." });
        }

        const userPosts = await QuesAns.find({ user : id });

        if (!userPosts || userPosts.length === 0) {
            return res.status(404).json({ message: "Koi Posts Nae hai es user ki" });
        }

        res.status(200).json(userPosts);
    } catch (error) {
        console.error("Error fetching posts:", error.message);
        res.status(500).json({ error: "An error occurred while fetching posts." });
    }
});

router.get('/getalldbpost', async (req,res)=>{
    try {
        // Post.find() yaha hm bina fetchuser ke sari post dekh sakte hain
            let QuesAnss = await QuesAns.find().populate('userId', 'name email');
            res.json(QuesAnss);
    } catch (error) {
        console.error("Error fetching all user posts:", error.message);
        res.status(500).send("Error occurred while fetching all posts");
    }
})


router.put("/updatepost/:id", fecthUser, async (req, res) => {
    try {
        const { question, categeory } = req.body;
        const Ques = await QuesAns.findById(req.params.id);
        if (!Ques) {
            return res.status(404).json("Post not found");
        }
        if(Ques.user.toString() !== req.user.id){
            return  res.status(401).send("Not Allowed For You");
        }
        let NewPost = {};
        if (question) NewPost.question = question;
        if (categeory) NewPost.categeory = categeory;

       
        const updatedPost = await QuesAns.findByIdAndUpdate(req.params.id, { $set: NewPost }, { new: true });
        res.json(updatedPost);
    } catch (error) {
        console.error("Error updating post:", error.message);
        res.status(500).send("There is an error in the update post API");
    }
});


router.delete('/deletepost/:id', fecthUser, async (req, res) => {
    try {
     let post = await QuesAns.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "No post found with this ID" });
        }

        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized to delete this post" });
        }

       post = await QuesAns.findByIdAndDelete(req.params.id);
        res.json({
            question: post.question,
            categeory: post.categeory,
            Success: "The note has been deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting post:", error.message);
        res.status(500).send("There was an error in the delete post API");
    }
});

module.exports = router;
