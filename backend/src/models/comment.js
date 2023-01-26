import mongoose from 'mongoose'


const { SubCommentModel } = require('./subcomment.js')
const { UserModel } = require('./user.js');
const CommentSchema = new mongoose.Schema({
    
    //id: the id of user, use to identify the action of a user
    // id: { type:ObjectId, required:true },

    //user: the user who create the post
    user:{ type:mongoose.Types.ObjectId, required:true, ref: 'User'},

    //comment_time: comment_time of the comment, used for order
    comment_time :{ type:Date, required:true },

    //comment_content: content of the comment
    comment_content:{ type:String ,required:true},

    //hashtag: hashtag options for each comment
    hashtag:[{type: String}],

    //subcomments:
    subcomments:[{ type : mongoose.Types.ObjectId, ref: 'SubComment'}],

    //like/dislike : used for popularity sort
    like:{ type : Number }, 
    dislike:{ type : Number },  

    //subcommentcount: used for popularity sort
    subcommentcount:{ type : Number },

    //agreeState: used for fontend rendering 1: agree, 2:disagree, 3:neutral
    agreestate:{ type :Number},

    underPost_id: {type: mongoose.Types.ObjectId, required:true, ref: 'Post'}

// id: id
// user: USER
// time: time
// content: string
// agreeState: {A, N, D} // 可以用POST裡面的三個comment array取代
// hashtag: string (下拉式選單: ‘有被說服’ ‘腦子呢’ ‘格局不夠’ ‘學校沒教？？’ ‘你媽失望了’)
// subComments: [SUBCOMMENT]
// like: int  //和同不同意無關
// dislike: int
// subcomment count: int

 });
 
 const CommentModel = mongoose.model('Comment', CommentSchema);
 
 export default CommentModel