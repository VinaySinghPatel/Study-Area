const mongoose = require('mongoose');
const { Schema } = mongoose;

const QuesAnsSchema = new Schema ({
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'user', 
    required : true
 },
  userId : {
  type : mongoose.Schema.Types.ObjectId,
  ref : 'user', 
  required : true
},
    question :{
        type : String,
        required : true
      } ,
      categeory :{
        type : String,
        required : true
      } ,answer : {
        type : String
      },
       fromdate : {
        type:Date,
        default : Date.now
      }
});

const QuesAns = mongoose.model('ques', QuesAnsSchema);
module.exports = QuesAns;