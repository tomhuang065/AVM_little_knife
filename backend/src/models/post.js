import mongoose from 'mongoose'


const { UserModel } = require('./user.js');
const { CommentModel } = require('./comment.js')
const PostSchema = new mongoose.Schema({
    
    //id: the id of user, use to identify the action of a user
    // id: { type: ObjectId , required:true},

    //poster: the person who create the post
    poster:{ type: mongoose.Types.ObjectId, required:true, ref: 'User'},

    //title: title of the post, used for header search
    title:{ type:String, required:true},

    //post_time: post_time of the post, used for header search
    post_time :{ type:Date, required:true },

    //theme: theme of the post
    theme:{ type:String, required:true },

    //post_contner: contnet of the post
    post_content:{ type:String ,required:true},

    //picture: for post, one by default
    // picture:{
    //     data: Buffer,
    //     contentType: String
    // }, //base64
    picture: {type:String},

    //hashtag: for post
    hashtag:{ type:String },

    //like/dislike : used for popularity sort
    like:{ type : Number }, 
    dislike:{ type : Number },  

    //commentcount: used for popularity sort
    commentcount:{ type : Number },

    //userpair : used to record the users of the post and the comment box color displayed for the user
    //format : userid-agreestate(0:Null, 1:Agree, 2:Disagree, 3:No opinion, 4:A2D, 5: D2A )
    userpair:[{ type : mongoose.Types.ObjectId, ref: 'User'}], //not used

    agreeUsers:[{ type : mongoose.Types.ObjectId, ref: 'User'}],
    disagreeUsers:[{ type : mongoose.Types.ObjectId, ref: 'User'}],
    neutralUsers:[{ type : mongoose.Types.ObjectId, ref: 'User'}],
    a2dUsers:[{ type : mongoose.Types.ObjectId, ref: 'User'}],
    d2aUsers:[{ type : mongoose.Types.ObjectId, ref: 'User'}],


    //comments : used to render the comments to the three boxes
    agreecomments:[{ type : mongoose.Types.ObjectId, ref: 'Comment'}], //d2a in this
    disagreecomments:[{ type : mongoose.Types.ObjectId, ref: 'Comment'}],//a2d in this
    neutralcomments:[{ type : mongoose.Types.ObjectId, ref: 'Comment'}],
    // a2dcomments:[{ type : mongoose.Types.ObjectId, ref: 'Comment'}],
    // d2acomments:[{ type : mongoose.Types.ObjectId, ref: 'Comment'}],

 });
 
 const PostModel = mongoose.model('Post', PostSchema);
 
 export default PostModel