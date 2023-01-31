import UserModel from './models/user.js'
import PostModel from './models/post.js';
import CommentModel from './models/comment.js';
import SubCommentModel from './models/subcomment.js';
import CustomerModel from './models/AVMmodels/customer.js';
import ItemModel from './models/AVMmodels/item.js';
import mongoose, { get } from 'mongoose';
import { compareSync } from 'bcryptjs';

const sendData = (data, ws) => {
    console.log("wsc ready",ws.readyState )
    ws.send(JSON.stringify(data)); 
}
const signIn =async (payload,ws) => {
    // await new CustomerModel({
    //     username: "testname",
    //     mail: "testmail",
    //     password: "testpassword",
      
    // }).save()
    const person1=await UserModel.findOne({nickname:payload.nickname});
    const person2=await UserModel.findOne({mail:payload.mail});
    if(!person1 && !person2 ){
        const person=await new UserModel({
            mail: payload.mail,
            password: payload.password,
            nickname: payload.nickname,
            introduction: "",
            self_web: "",
            picture:"",
            like_post:[],
            dislike_post:[],
            noti:[],
        }).save()
        ws.mail=person.mail;
        sendData(['signInStatus',{status:true,User:person}],ws);
    }else{
        sendData(['signInStatus',{status:false,User:''}],ws);
    }
}
const login =async (payload,ws) => {
    // await new CustomerModel({
    //     username: "testname",
    //     mail: "testmail",
    //     password: "testpassword",
      
    // }).save()
    const person=await UserModel.findOne({mail:payload.mail}).populate("noti");
    if(!person){
        sendData(['loginStatus',{status:false,User:''}],ws);
    }else{
        ws.mail=person.mail;
        sendData(['loginStatus',{status:true,User:person}],ws);
    }
    
}
const editUser =async (payload,ws) => {
    const person=await UserModel.findOne({nickname:payload.oldName});
    person.nickname=payload.newName;
    person.introduction=payload.intro;
    person.picture=payload.image;
    person.self_web=payload.web;
    await person.save();
    sendData(['editUser',{User:person}],ws);
}
const editLike =async (payload,ws) => {
    const post=await PostModel.findById(payload.post).populate("poster");
    const user=await UserModel.findById(payload.user);
    payload.type==1?(
        (payload.status)?
            (post.like+=1,user.like_post.push(post.id)):
            (post.like-=1,user.like_post = user.like_post.filter(item => item != payload.post.toString()))
    ):payload.type==2?(
        (payload.status)?
            (post.dislike+=1,user.dislike_post.push(post.id)):
            (post.dislike-=1,user.dislike_post = user.dislike_post.filter(item => item != payload.post.toString()))
    ):(payload.status)?(
        post.like+=1,
        post.dislike-=1,
        user.like_post.push(post.id),
        user.dislike_post = user.dislike_post.filter(item => item != payload.post.toString())):
        (post.like-=1,
        post.dislike+=1,
        user.dislike_post.push(post.id),
        user.like_post = user.like_post.filter(item => item != payload.post.toString()));
    await post.save();
    await user.save();
    sendData(['editLike',{Post:post,User:user}],ws);
}

const createItem = async (payload, ws) => {
    // sendData(['createPost',{status:true}],ws);
    console.log(payload)
    const newItem = await new ItemModel(payload);
    // console.log("newPost: ", newPost);
    // sendData(['createPost',{status:true, newPostId: newPost.id}],ws);
    await newItem.save();
    // if.. sendData..?
}
const updateItem = async (payload, ws) => {
    // sendData(['createPost',{status:true}],ws);
    console.log(payload)
    const UpdateItem = await ItemModel.findOneAndUpdate(
        {itemname:payload.itemname}, {$set:{itemname:payload.newname, price:payload.price, description:payload.description}}
    );
    // console.log("newPost: ", newPost);
    // sendData(['createPost',{status:true, newPostId: newPost.id}],ws);
    // await newItem.save();
    // if.. sendData..?
}
const deleteItem = async (payload, ws) => {
    // sendData(['createPost',{status:true}],ws);
    console.log(payload)
    const UpdateItem = await ItemModel.findOneAndDelete(
        {itemname:payload}
    );
}
const findItemName = async (ws) => {
    const list = await ItemModel.find();
    console.log(list)
    sendData(['getItemName', {List:list}], ws)
}
const createComment = async (payload, ws,wss) => {
    const newComment = await new CommentModel(payload).save();
    const pushUnderPost = 
            (payload.agreestate === 1 || payload.agreestate === 5) ? await PostModel.findOneAndUpdate(
                {_id: payload.underPost_id}, {$push: {agreecomments: newComment._id}}, {returnOriginal: false}
            ):
            await PostModel.findOneAndUpdate(
                {_id: payload.underPost_id}, {$push: {disagreecomments: newComment._id}}, {returnOriginal: false}
            );
            
    if(newComment){
        wss.clients.forEach((client) => {
            if(client.now==payload.underPost_id){
                sendData(['findComments', {Comment: newComment}], client);
            }
        })
    }
    const post=await PostModel.findById(payload.underPost_id).populate("poster");
    const poster=await UserModel.findById(post.poster._id).populate("noti");
    poster.noti.unshift({icon:"CommentIcon",message:`Someone reply your post`,id:payload.underPost_id});
    await poster.save();
    wss.clients.forEach( async (client) => {
        if(client.mail==poster.mail){
            sendData(['noti',{User:poster}],client);
        }
    });
}
const createSubComment = async (payload, ws,wss) => {
    const newSubComment = await new SubCommentModel(payload).save();
    // console.log("newSubComment: ", newSubComment);
    if(newSubComment){
        wss.clients.forEach((client) => {
            if(client.now==payload.sub_underPost_id){
                // console.log(client.mail,client.now)
                sendData(['findSubComments', newSubComment], client);
    }
        })
    }
    const comment=await CommentModel.findById(payload.underComment_id).populate("user");
    const comment_user=await UserModel.findById(comment.user._id).populate("noti");
    const post=await PostModel.findById(payload.sub_underPost_id).populate("poster");
    const post_user=await UserModel.findById(post.poster._id).populate("noti");
    comment_user.noti.unshift({icon:"ReplyIcon",message:"Someone reply your commit",id:payload.sub_underPost_id});
    await comment_user.save();
    if(comment_user.id!=post_user.id){
        post_user.noti.unshift({icon:"CommentIcon",message:"Someone reply your post",id:payload.sub_underPost_id});
        await post_user.save();
    }
    wss.clients.forEach( async (client) => {
        if(client.mail==comment_user.mail){
            sendData(['noti',{User:comment_user}],client);
        }else if(client.mail==post_user.mail){
            sendData(['noti',{User:post_user}],client);
        }
    });
}
const getPostsFromDB = async (payload, ws) => {
    const {sorttype, fromPostNum, theme} = payload;
    const posts = sorttype? 
        (theme===''?
        await PostModel.find().populate('poster').sort({_id: -1}).skip(fromPostNum).limit(10):
        await PostModel.find({theme}).populate('poster').sort({_id: -1}).skip(fromPostNum).limit(10))
        :
        (theme===''?
        await PostModel.find().populate('poster').sort({like: -1}).skip(fromPostNum).limit(10):
        await PostModel.find({theme}).populate('poster').sort({like: -1}).skip(fromPostNum).limit(10));
    // console.log("POST from DB", fromPostNum);
    const newPostsCount = posts.length;
    // console.log("allpostcount", newPostsCount);
    if(posts){
        sendData(['dashboardPosts', {posts, newPostsCount}], ws);
    }
}

const getPostby_id = async (payload,ws) => {
    const {_id} = payload;
    ws.now=_id;
    const post = _id? await PostModel.findOne({_id}).populate('agreecomments').populate('disagreecomments').populate('neutralcomments').populate('poster'):{};
    const subs = _id? await SubCommentModel.find({sub_underPost_id: _id}):[];
//find all subcomment in this post...


    if(post!={}){
        // let ret = await post[0].populate('agreecomments');
        // const ret = await PostModel.findOne({_id}).populate('agreecomments').exec(function(err, com){
        //     console.log('POST POPULATE: ', com);
        // })
        // console.log("fullNotificationPost", post);
        sendData(['fullNotificationPost', {post, subs}], ws);
        // console.log("ws post", post);
    }
    
}

const modifyPostANDUsers = async (payload, ws) => {
    // const {post_id, user_id, agreestate} = payload;
    await PostModel.updateOne({_id: payload.post_id}, {$pull: {agreeUsers: payload.user_id}}, {returnOriginal: false});
    await PostModel.updateOne({_id: payload.post_id}, {$pull: {disagreeUsers: payload.user_id}}, {returnOriginal: false});
    await PostModel.updateOne({_id: payload.post_id}, {$pull: {neutralUsers: payload.user_id}}, {returnOriginal: false});
    await PostModel.updateOne({_id: payload.post_id}, {$pull: {a2dUsers: payload.user_id}}, {returnOriginal: false});
    await PostModel.updateOne({_id: payload.post_id}, {$pull: {d2aUsers: payload.user_id}}, {returnOriginal: false});
    
    
    // const pushPost = 
      payload.agreestate === 1 ? await PostModel.updateOne(
        {_id: payload.post_id}, {$push: {agreeUsers: payload.user_id}}, {returnOriginal: false})
    : payload.agreestate === 2 ? await PostModel.updateOne(
        {_id: payload.post_id}, {$push: {disagreeUsers: payload.user_id}}, {returnOriginal: false})
    : payload.agreestate === 3 ? await PostModel.updateOne(
        {_id: payload.post_id}, {$push: {neutralUsers: payload.user_id}}, {returnOriginal: false})
    : payload.agreestate === 4 ? await PostModel.updateOne(
        {_id: payload.post_id}, {$push: {a2dUsers: payload.user_id}}, {returnOriginal: false})
    :                            await PostModel.updateOne(
        {_id: payload.post_id}, {$push: {d2aUsers: payload.user_id}}, {returnOriginal: false});
    
    const getpost = {_id: payload.post_id};
    await getPostby_id(getpost,ws);
    // console.log("modifyPost: ", pushPost);
}

export default {
    onMessage: (ws,wss) => (
        ws.onmessage =async function(byteString) {
            const { data } = byteString
            const [task, payload] = JSON.parse(data)
            // console.log(task);
            // console.log(payload);
            switch (task) {
                case 'signIn': {
                    signIn(payload,ws);
                    break;
                }
                case 'login': {
                    login(payload,ws);
                    break;
                }
                case 'editUser': {
                    editUser(payload,ws);
                    break;
                }
                case 'editLike': {
                    editLike(payload,ws);
                    break
                }
                case 'createItem': {
                    // console.log("createpostdata",  payload);
                    createItem(payload, ws);
                    break;
                }
                case 'updateItem': {
                    // console.log("createpostdata",  payload);
                    updateItem(payload, ws);
                    break;
                }
                case 'deleteItem':{
                    deleteItem(payload, ws);
                    break;
                }
                case 'createItem': {
                    // console.log("createpostdata",  payload);
                    createItem(payload, ws);
                    break;
                }
                case 'findItemName':{
                    findItemName(ws);
                }
                case 'createComment':{
                    const Comments = await createComment(payload, ws,wss);
                    // console.log("getcomment", payload)
                    break;
                }
                case 'createSubComment':{
                    const subComments = await createSubComment(payload, ws,wss);
                    // console.log("getsubcomment", payload)
                    break;
                }
                case 'getDashboardPosts': {
                    const Posts = await getPostsFromDB(payload, ws);
                    break;

                }
                case 'getNotificationPost': {
                    const Post = await getPostby_id(payload,ws);
                    break;
                }
                case 'modifyANDUsers': {
                    modifyPostANDUsers(payload, ws);
                    break;
                }
            }
        }
    )
}
