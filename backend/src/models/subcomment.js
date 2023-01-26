import mongoose from 'mongoose'

// const { UserModel } = require('./user.js');
import UserModel from './user';

const SubCommentSchema = new mongoose.Schema({
    
    // id: { type:ObjectId, required:true },

    //user: the user who create the post
    user:{ type: mongoose.Types.ObjectId, required:true, ref: 'User'},

    //subcomment_time: comment_time of the subcomment, used for order
    subcomment_time :{ type:Date, required:true },

    //subcomment_content: content of the subcomment
    subcomment_content:{ type:String ,required:true},

    //hashtag: hashtag options for each comment
    hashtag:[{type:String}],

    //AgreeState: 1:agree , 2:disagree, 3:neutral, 4:agree to disagree 5; disagree to agree
    agreestate:{ type:Number, required:true },

    underComment_id: {type: mongoose.Types.ObjectId, required:true, ref: 'Comment'},
    sub_underPost_id: {type: mongoose.Types.ObjectId, required:true, ref: 'Post'},
    //subcomments:
    // subcomments:{ type : [SubCommentModel]},

    //like/dislike : used for popularity sort
    like:{ type : Number }, 
    dislike:{ type : Number },  




    // REPLY SUBCOMMENT schema

    // id: id
    // user: USER
    // time: time
    // content: string
    // agreeState: {A, N, D} // 必留 放在comment底下才知道要用什麼顏色
    // hashtag: string (下拉式選單: ‘被說服’ ‘腦子呢’ )
    // like: int  //和同不同意無關
    // dislike: int
    

 });
 
 const SubCommentModel = mongoose.model('SubComment', SubCommentSchema);
 
 export default SubCommentModel