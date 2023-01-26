import User from './models/user'
import Post from './models/post'
import Comment from './models/comment'
import SubComment from './models/subcomment'
import UserData from './initdatabase/user'
import PostData from './initdatabase/posts'
import SubcommentData from './initdatabase/subcomment'

const dataInit = async () => {
    console.log("Data initializing");
    await User.deleteMany({})
    await User.insertMany(UserData);
    await Post.deleteMany({})
    const alluser = await User.findOne({nickname:'spong'});
    for(var i=0; i< PostData.length; i++){

        const newPost = new Post(PostData[i]);
        newPost.poster=alluser;
        newPost.save();
    }
    // console.log("alluser: ",alluser);

}

export default dataInit;