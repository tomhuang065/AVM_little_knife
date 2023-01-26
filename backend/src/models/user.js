import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    
    //id: the id of user, use to identify the action of a user
    // id: { type:ObjectId, required:true },

    //account/password: used for login
    mail:{ type:String , require:true},//account: email
    password:{ type:String , require:true}, //need to be changed to bcript

    //nickname : the name displayed on profile or comment and posts
    nickname: {type: String },

    //mail: for profile
    // mail:{ type:String , require:true},

    //introduction: for profile
    introduction:{type:String},
    
    //picture: for profile
    picture:{type:String}, //base64

    //picture: for profile
    self_web:{type:String},


    like_post:[{ type:String}],
    dislike_post:[{ type:String}],
    noti:[{
        icon:String,
        message:String,
        id:String,
    }]
//     id: id
//     account: string
//     password: password bcrypt 
//     mail:string
//     nickname: string
//     introduction:string
//     picture:base64
//     self_web:string

 });
 
 const UserModel = mongoose.model('User', UserSchema);
 
 export default UserModel