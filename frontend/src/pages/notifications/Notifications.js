import React, { useState, useEffect } from "react";
import { Grid, CircularProgress,Modal } from "@material-ui/core";
import {Paper, Box, TextField, IconButton, InputAdornment} from "@mui/material"
import { useParams } from "react-router-dom";
import { useChat } from "../../context/OurContext";
// styles
import "react-toastify/dist/ReactToastify.css";
import useStyles from "./styles";
// import {CancelOutlinedIcon, SendTwoToneIcon} from '@mui/icons-material';
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import Chart from "../../components/chart";

// components
import Widget from "../../components/Widget/Widget";
import Notification from "../../components/Notification";
import { Typography, Button } from "../../components/Wrappers/Wrappers";


export default function NotificationsPage(props) {
  var classes = useStyles();

  // local
  const [CommentBoxColor, setCommentBoxColor] = useState('');
  const {post_id} = useParams(); //use this post_id to get post from db, and fill notification.
  const {sendGetNotificationPost, NotificationPost, PostIsLoading, setPostIsLoading} = useChat(); //NotificationPost is post retrieved from db with _id
  const [commentContent, setCommentContent] = useState('');
  const {sendCreateComment, person, comment,renderCommentAgree,setRenderCommentAgree,
    renderCommentDisagree,setRenderCommentDisagree,renderCommentNeutral,setRenderCommentNeutral, modifyPostA_N_D_UsersArr} = useChat();
  const [selected, setSelected] = useState(false);
  const [nickname, setNickname] = useState('');
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('');
  const [displayAgreeState, setDisplayAgreeState] =useState('')
  const [DBAgreeState, setDBAgreeState] = useState(0);
  const [open,setOpen] = useState(false);



  useEffect(()=> {
    if(post_id){
      setPostIsLoading(true);
      sendGetNotificationPost(post_id);
    }
  },[post_id])

  useEffect(()=> {
    //get the username of post
    if(NotificationPost){
      findUserAgreeState();
    }    
  },[NotificationPost])
  
  const findUserAgreeState = () => {
    if(NotificationPost.agreeUsers?.includes(person._id) ){
      setDisplayAgreeState("Agree")
      setSelected(true);
      setDBAgreeState(1);
    }
    else if(NotificationPost.disagreeUsers?.includes(person._id)){
      setDisplayAgreeState("Disagree")
      setSelected(true);
      setDBAgreeState(2);
    }
    else if(NotificationPost.neutralUsers?.includes(person._id)){
      setDisplayAgreeState("Neutral")
      setSelected(true);
      setDBAgreeState(3);
    }
    else if(NotificationPost.a2dUsers?.includes(person._id)){
      setDisplayAgreeState("Disagree")
      setSelected(true);
      setDBAgreeState(4);
    }
    else if(NotificationPost.d2aUsers?.includes(person._id)){
      setDisplayAgreeState("Agree")
      setSelected(true);
      setDBAgreeState(5);
    }
    else{
      setDisplayAgreeState("Not yet")
      setSelected(false);
      setDBAgreeState(0);
    }
  }
 
  useEffect(()=> {
    if(typeof(comment)!== 'undefined' && comment !== ''){
      if(comment.agreestate=== 1 || comment.agreestate=== 5){
        setRenderCommentAgree([...renderCommentAgree,comment])
      }
      else if(comment.agreestate=== 2 || comment.agreestate=== 4){
        setRenderCommentDisagree([...renderCommentDisagree, comment])
      }
      else{
        setRenderCommentNeutral([...renderCommentNeutral, comment])
      }
    }
  },[comment])

  const checkselect = (astate) =>{
    setSelected(true)
    //modify db post's agreeUsers...
    modifyPostA_N_D_UsersArr(post_id, person._id, astate);

  }

  const onSendCreateCommentContent = async () => {
    console.log("person: ",person._id);
    if(!commentContent ){
        throw console.error("Some field missing");
    }

    const payload = {
        user: person._id,
        comment_time: new Date(),
        comment_content: commentContent,
        agreestate: DBAgreeState,
        underPost_id: post_id
        
    }
    sendCreateComment(payload);
    console.log("PL", payload);
    setCommentContent('');
  }

  useEffect(() => {
    switch(DBAgreeState){
      case 0:
        setCommentBoxColor('white')
        break;
      case 1: //agree 
        setCommentBoxColor('#3cd4a1')
        break;
      case 2: //disagree
        setCommentBoxColor('#fdaec9')
        break;
      case 3:
        setCommentBoxColor('#bdbdbd')
        break;
      case 4:
        setCommentBoxColor('#fcccdd')
        break;
      case 5:
        setCommentBoxColor('#9aecd0')
        break;
      
      default:
        setCommentBoxColor('white')

    }
  }, [DBAgreeState]);


  return (
    <>
      {PostIsLoading? //NotificationPost._id === post_id : // at end: should add Loading... NotificationPost._id === post_id
        <CircularProgress size={100}/>:
        <>
        <Grid container spacing={4} style={{backgroundColor:"#f5f5f5"}}>
          <Grid item xs={12} >
            <Paper elevation={15} style = {{ borderRadius: 7, backgroundColor:"#f5f5f5",display:"flex", flexDirection:"column", height:"100%"}}>
              <Grid container spacing={4}>
                <Grid item xs={9}>
                  <Box>
                    <Typography variant="h4" style={{marginTop:"20px",marginLeft:"20px"}}>{NotificationPost.title}</Typography>
                  </Box>
                  <Box p={5} style = {{backgroundColor:"#f5f5f5", maxWidth:"100%" ,height:"300px", padding:'20px'}}>
                    <img src= {NotificationPost.picture} border= '2px solid black' style={{maxWidth:'100%',height:'100%'}} alt="No Pic" onClick={()=>{setOpen(true)}}></img>
                  </Box>
                  <Box p={5} style = {{backgroundColor:"#e5e5e5", height:"250px",overflowY:'scroll',wordBreak:'break-all',marginLeft:"10px",marginBottom:"10px"}}>
                    <Typography variant="h6" style={{whiteSpace:'pre-wrap'}} >{NotificationPost.post_content}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} style={{marginTop:'10%'}}>
                      <Box p={1} style = {{borderRadius: 7, backgroundColor:"#c3f5fa",width:'80%',marginLeft:'10%'}}>
                        <Typography variant="h6">Theme: {NotificationPost.theme}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box p={1} style = {{borderRadius: 7,backgroundColor:"#b3e5fc",width:'80%',marginLeft:'10%'}}>
                        <Typography variant="h6">Poster: {NotificationPost.poster?NotificationPost.poster.nickname:''}</Typography>

                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box p={1} style = {{borderRadius: 7,backgroundColor:"#b3e5fc",width:'80%',marginLeft:'10%'}}>
                        <Typography variant="h5">{typeof(NotificationPost.post_time) === "string"? NotificationPost.post_time.split("T")[0]: null} {typeof(NotificationPost.post_time) === "string"? parseInt(NotificationPost.post_time.split("T")[1].split(".")[0].split(":")[0]) >15 ? parseInt(NotificationPost.post_time.split("T")[1].split(".")[0].split(":")[0])-16:parseInt(NotificationPost.post_time.split("T")[1].split(".")[0].split(":")[0])+8:null}:
                        {typeof(NotificationPost.post_time) === "string"? NotificationPost.post_time.split("T")[1].split(".")[0].split(":")[1]:null}:{typeof(NotificationPost.post_time) === "string"?NotificationPost.post_time.split("T")[1].split(".")[0].split(":")[2]:null}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                    {selected?<Chart data={
                      [{
                        title: NotificationPost.agreeUsers?.length === 0?'':NotificationPost.agreeUsers?.length , color: '#3cd4a1', value: NotificationPost.agreeUsers?.length
                       },
                       {
                        title: NotificationPost.disagreeUsers?.length === 0?'':NotificationPost.disagreeUsers?.length , color: '#fdaec9', value: NotificationPost.disagreeUsers?.length
                       },
                       {
                        title: NotificationPost.a2dUsers?.length === 0?'':NotificationPost.a2dUsers?.length , color: '#fcccdd', value: NotificationPost.a2dUsers?.length
                       },
                       {
                        title: NotificationPost.d2aUsers?.length === 0?'':NotificationPost.d2aUsers?.length , color: '#9aecd0', value: NotificationPost.d2aUsers?.length
                       }
                       ]
                    }/>:<></>}
                    </Grid>
                    <Grid item xs={12} >
                      {displayAgreeState === 'Not yet'?<Button onClick={()=> {checkselect(1); findUserAgreeState()}} style={{backgroundColor:'#3cd4a1',width:'50%',marginLeft:'25%'}}>Agree</Button>:<></>}
                      {displayAgreeState === 'Not yet'?<Button onClick={()=> {checkselect(2); findUserAgreeState()}} style={{backgroundColor:'#fdaec9',width:'50%',marginLeft:'25%', marginTop:"7%"}}>Disagree</Button>:<></>}
                      {displayAgreeState === 'Agree'?<Button onClick={()=> {checkselect(4); findUserAgreeState()}} style={{backgroundColor:'#fcccdd',width:'50%',marginLeft:'25%', marginTop:"7%"}}>Change to Disagree</Button>:<></>}
                      {displayAgreeState === 'Disagree'?<Button onClick={()=> {checkselect(5); findUserAgreeState()}} style={{backgroundColor:'#9aecd0',width:'50%',marginLeft:'25%', marginTop:"7%"}}>Change to Agree</Button>:<></>}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        
          {selected?
            
              <Grid item xs={12}>
                <Paper style={{ width:"100%", border:10 , backgroundColor:"f5f5f5" }} >
                  <TextField  multiline fullWidth id="outlined-basic" label="Comment" variant="outlined" style={{ width:"100%"}} value={commentContent} 
                  onChange={e => setCommentContent(e.target.value)} onClick={() => onSendCreateCommentContent()}
                              sx={{"& .MuiOutlinedInput-root": {"&.Mui-focused fieldset": {borderColor: CommentBoxColor, borderWidth: 5}}}}
                              InputProps={{endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton aria-label="delete" size="small" style = {{marginLeft:100}}>
                                      <SendTwoToneIcon />
                                    </IconButton>
                                  </InputAdornment>
                                ),}}
                  />
                </Paper>
              </Grid>
            
            :<div></div>}
            {selected?
              <Grid item xs={12} md={6} lg={6}>
                <Widget title="Agree" disableWidgetMenu>
                  { renderCommentAgree.map((com) => (
                      <Notification 
                        className={classes.notificationItem}
                        shadowless
                        type="message"
                        message={com.comment_content}
                        variant="contained"
                        color= {com.agreestate===1?'#3cd4a1':'#9aecd0'}
                        userColor = {CommentBoxColor}
                        agree = {DBAgreeState}
                        thisComment_id = {com._id}
                        thisPost_id = {post_id}
                        >
                      </Notification>
                    ))
                  }
                </Widget>
              </Grid>   
            :<div></div>}
            {selected?
              <Grid item xs={12} md={6} lg={6}>
                <Widget title="Disagree" disableWidgetMenu sx={{backgroundColor:"red", justifyContent:"center"}}>
                  { renderCommentDisagree.map((com) => (
                      <Notification 
                        className={classes.notificationItem}
                        shadowless
                        type="message"
                        message={com.comment_content}
                        variant="contained"
                        color={com.agreestate===2?'#fdaec9':'#fcccdd'}
                        userColor = {CommentBoxColor}
                        agree = {DBAgreeState}
                        thisComment_id = {com._id}
                        thisPost_id = {post_id}
                        >
                      </Notification>
                    ))
                  }
                </Widget>
                </Grid>   
            :<div></div>}
        </Grid>
      </>}
        <Modal
        open={open}
        onClose={()=>{setOpen(false)}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
            <Paper style={{width:"80%",marginLeft:'10%',maxHeight:'700px',marginTop:"1%",overflowY:'scroll'}}>
              <img src= {NotificationPost.picture} border= '2px solid black' style={{width:'100%'}} alt="No Pic" onClick={()=>{setOpen(false)}}/>     
            </Paper>
        </Box>
      </Modal>
    </>
  );
}
