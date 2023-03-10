import { useState,useContext,createContext } from "react";
import { useUserDispatch} from "./UserContext";
import { useHistory} from "react-router-dom"

var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
const WS_URL=process.env.NODE_ENV==="production"?
    window.location.origin.replace(/^http/,"ws"):
    "ws://localhost:4000"
let client=new WebSocket(WS_URL);
let interval;
const sendData=async (data)=>{
    if(client.readyState === 1){
        client.send(
            JSON.stringify(data)
        );
    }
};
const ChatContext = createContext({
    password:'',
    signIn:()=>{},
    login:()=>{},
    isLoading:false,
    error:null,
    sendCreateItem: ()=>{},
    sendDeleteItem:() => {},
    sendUpdateItem: ()=>{},
    sendFindItemName: () => {},
    sendFindProductName: () => {},
    sendCreateProduct:() => {},
    sendUpdateProduct: ()=>{},
    sendDeleteProduct: ()=>{},
    sendCreatePurchase:() => {},
    sendCreateProfit:() => {},
    itemNames:{},
    productNames:{},
    purchaseNames:{},
    profitNames:{},
    person: {},
    sendGetPurchases:() =>{},
    sendGetProfits:() =>{},
    DashboardPosts: [],
    currentLocation: '',
    sendGetNotificationPost: () => {},
    NotificationPost: {},
    editUser:()=>{},
    comment:'',
    subComment:'',
    show_number:'',
    editLike:() => {},
    renderCommentAgree: [],
    renderCommentDisagree: [],
    renderCommentNeutral: [],
    subs_in_this_post: [],
    modifyPostA_N_D_UsersArr: () => {},
    isNotificationsUnread:'',
    PostIsLoading:true,
    allTheme: [],
    DashPostsIsLoading:true,
    cir:false,
    jumpDash:false, 
    jumpPostId: ''
});

const allTheme = [
    "價值標的一",
    "價值標的二",
    "價值標的三",
    "價值標的四",
    "價值標的五"
] 
const ChatProvider = (props) => {
    var userDispatch = useUserDispatch();
    var [isLoading, setIsLoading] = useState(false);
    var [error, setError] = useState(null);
    var [password,setPassword] = useState('');
    const [person, setPerson] = useState({});
    const [itemNames, setItemNames] = useState([]);
    const [productNames, setProductNames] = useState([]);
    const [purchaseNames, setPurchaseNames] = useState([]);
    const [profitNames, setProfitNames] = useState([]);
    const [DashboardPosts, setDashboardPosts] = useState([]);
    const [currentLocation, setCurrentLocation] = useState('');
    const [NotificationPost, setNotificationPost] = useState({});
    const [ comment, setComment ] = useState('');
    const [renderCommentAgree, setRenderCommentAgree] = useState([]);
    const [renderCommentDisagree, setRenderCommentDisagree] = useState([]);
    const [renderCommentNeutral, setRenderCommentNeutral] = useState([]);
    const [subs_in_this_post, setSubs_in_this_post] = useState([]);
    var [show_number,setShow_number]=useState(0);
    var [isNotificationsUnread, setIsNotificationsUnread] = useState(false);
    const [PostIsLoading, setPostIsLoading] = useState(true);
    const [DashPostsIsLoading, setDashPostsIsLoading] = useState(true);
    const [cir,setCir] = useState(false);
    const [jumpDash, setJumpDash] = useState(false);
    const [jumpPostId, setJumpPostId] = useState('');

    const signIn=(payload) => {
        payload.password=bcrypt.hashSync(payload.password, salt);
        sendData(['signIn',payload]);
    };
    const login=(payload) => {
        setPassword(payload.password);
        payload.password=bcrypt.hashSync(payload.password, salt);
        sendData(['login',payload]);
    };
    const editUser=(payload) => {
        sendData(['editUser',payload]);
    }
    const editLike = (payload) => {
        sendData(['editLike',payload]);
    }
    const sendCreateItem = (payload) => {
        sendData(['createItem', payload ])
    }
    const sendDeleteItem = (payload) => {
        sendData(['deleteItem', payload ])
    }
    const sendUpdateItem = (payload) => {
        console.log(payload)
        sendData(['updateItem', payload ])
    }
    const sendFindItemName = (payload) =>{
        sendData(['findItemName', payload])
    }
    const sendFindProductName = (payload) =>{
        sendData(['findProductName', payload])
    }
    const sendCreateProduct = (payload) => {
        sendData(['createProduct', payload ])
    }
    const sendUpdateProduct = (payload) => {
        console.log(payload)
        sendData(['updateProduct', payload ])
    }
    const sendDeleteProduct = (payload) => {
        sendData(['deleteProduct', payload ])
    }
    const sendCreatePurchase = (payload) => {
        sendData(['createPurchase', payload ])
    }
    const sendCreateProfit = (payload) => {
        console.log(payload)
        sendData(['createProfit', payload ])
    }
    const sendGetPurchases = (payload) => {
        sendData(['getPurchases', payload]);
    }
    const sendGetProfits = (payload) => {
        sendData(['getProfits', payload]);
    }
    const sendGetNotificationPost = (_id) => {
        sendData(['getNotificationPost',{_id}])
    }
    const modifyPostA_N_D_UsersArr = (post_id, user_id, agreestate) => {
        sendData(['modifyANDUsers', {post_id, user_id, agreestate}])
    }
    
    client.onmessage = (byteString) => {
        const [task, payload] = JSON.parse(byteString.data);
        // console.log(task);
        // console.log(payload);
        if (task !=''){
            clearInterval(interval);
            interval = setInterval(function() {
                client = new WebSocket(WS_URL);
            }, 20000);
        }
        switch (task) {
            case 'getItemName':{
                console.log(payload.List)
                setItemNames(payload.List)
                break;
            }
            case 'getProductName':{
                console.log(payload.List)
                setProductNames(payload.List)
                break;
            }
            case 'getPurchase':{
                setPurchaseNames(payload.List)
                break;

            }
            case 'getProfit':{
                setProfitNames(payload.List)
                break;

            }
            case "signInStatus": {
                if(payload.status===true){
                    localStorage.setItem('id_token', 1)
                    setError(null);
                    setIsLoading(false);
                    userDispatch({ type: 'LOGIN_SUCCESS' })
                    setPerson(payload.User);
                }else{
                    setError(true);
                    setIsLoading(false);
                }
                break; 
            }
            case "editUser": {
                setPerson(payload.User);
                break;
            }
            case "editLike": {
                setDashboardPosts(DashboardPosts.map((e)=>(
                    (e._id==payload.Post._id)?(payload.Post):(e))));
                setPerson(payload.User);
                break;
            }
            case "createPost": {
                // console.log("CR OUR", payload)
                // if(payload.status===true){
                //     alert("Your post is being uploaded!");
                //     // history.push('/app/dashboard')
                //     // setJumpPostId(payload.newPostId)
                //     setJumpDash(true);
                // }
                break;
            }
            
            case "dashboardPosts": {
                const {posts} = payload;
                if(posts!=undefined){
                    setDashboardPosts([...DashboardPosts,...posts])
                    setShow_number(show_number+posts.length);
                };
                setDashPostsIsLoading(false);
                setCir(false);
                break;
            }
            case "noti": {
                setPerson(payload.User);
                setIsNotificationsUnread(true);
                break;
            }
            case "findComments": {
                setComment(payload.Comment)
                // console.log("get comment from backend!", payload.Comment);
                break;
            }
            case "findSubComments": {
                setSubs_in_this_post([...subs_in_this_post , payload]) //payload doesn't have _id yet, to solve it should set after db resend back to frontend
                break;
            }
            case 'fullNotificationPost': {
                const {post, subs} = payload;
                setNotificationPost(post);
                setPostIsLoading(false);
                // console.log("fullNotificationPost post",post);
                // console.log("fullNotificationPost subs", subs);
                if(post.agreecomments) setRenderCommentAgree(post.agreecomments);
                if(post.disagreecomments) setRenderCommentDisagree(post.disagreecomments);
                if(post.neutralcomments) setRenderCommentNeutral(post.neutralcomments);
                
                setSubs_in_this_post(subs);
                // if(subs)
                
                break;
            }

            case "loginStatus": {
                if(payload.status===true && bcrypt.compareSync(password,payload.User.password)){
                    localStorage.setItem('id_token', 1);
                    setError(null);
                    setIsLoading(false);
                    userDispatch({ type: 'LOGIN_SUCCESS' })
                    // console.log("User:: ",payload.User);
                    setPerson(payload.User);
                }else{
                    setError(true);
                    setIsLoading(false);
                }
                
                break; 
            }
            default: break;
        }
    }

    return (
        <ChatContext.Provider
            value={{
                signIn,login,
                isLoading,setIsLoading,
                error,setError,
                // createPostData, setCreatePostData
                person,
                itemNames,
                productNames,
                purchaseNames,
                profitNames,
                sendCreateItem,
                sendUpdateItem,
                sendDeleteItem,
                sendFindItemName,
                sendFindProductName,
                sendCreateProduct,
                sendUpdateProduct,
                sendDeleteProduct,
                sendCreatePurchase,
                sendCreateProfit,
                sendGetPurchases,
                sendGetProfits,
                DashboardPosts,
                setDashboardPosts,
                currentLocation,setCurrentLocation,
                sendGetNotificationPost,
                NotificationPost,editUser,
                show_number,setShow_number,
                editLike,
                comment,
                renderCommentAgree, setRenderCommentAgree,
                renderCommentDisagree, setRenderCommentDisagree,
                renderCommentNeutral, setRenderCommentNeutral,
                subs_in_this_post, setSubs_in_this_post,
                modifyPostA_N_D_UsersArr,
                isNotificationsUnread, setIsNotificationsUnread,
                PostIsLoading, setPostIsLoading, allTheme,
                DashPostsIsLoading, setDashPostsIsLoading,cir,
                jumpDash, setJumpDash, jumpPostId
            }}
            {...props}
        />
    );
};
const useChat = () => useContext(ChatContext);
export { ChatProvider, useChat,client };
