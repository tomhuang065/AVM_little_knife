// This file is for testing
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
const data = [
    {
        mail: "spong@gmail.com",
        password: "1234",
        nickname: "spong",
        introduction: "helloworld",
        self_web: "https://www.ntu.edu.tw/",
        like_post:[],
        dislike_post:[],
    },
    {
        mail: "tommy@gmail.com",
        password: "12345",
        nickname: "tommy",
        introduction: "helloworld2",
        self_web: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        like_post:[],
        dislike_post:[],
    },
    {
        mail: "glen@gmail.com",
        password: "123456",
        nickname: "glen",
        introduction: "helloworld3",
        self_web: "https://www.youtube.com/watch?v=E9de-cmycx8",
        like_post:[],
        dislike_post:[],
    },
    {
        mail: "a",
        password: bcrypt.hashSync("a", salt),
        nickname: "a",
        introduction: "a",
        self_web: "https://www.youtube.com/watch?v=E9de-cmycx8",
        like_post:[],
        dislike_post:[],
        noti:[],
    }
]

export default data;