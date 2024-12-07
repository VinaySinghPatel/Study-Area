const mongoose = require('mongoose');
const {Schema} = mongoose;

const AnsSchema = new Schema ({
    questionId: { type: mongoose.Schema.Types.ObjectId,
         ref: "ques", 
         required: true 
        },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user', 
        required : true
     },
    answer :{
        type : String,
        required : true
      } ,
       fromdate : {
        type:Date,
        default : Date.now
      }
});

const Answer = mongoose.model('answer',AnsSchema);
module.exports = Answer;