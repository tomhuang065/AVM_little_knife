import React, { useEffect, useState } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import MessageIcon from '@mui/icons-material/Message';
import { useHistory } from "react-router-dom";
import Checkbox from '@mui/material/Checkbox';
import { useChat } from "../../../../context/OurContext";
// styles

// components
import { Typography } from "../../../../components/Wrappers/Wrappers";

export default function Topthree(props) {
  var {editLike,person} = useChat();
  var { _id ,poster, title, theme, post_time, post_content, picture, hashtag, like, dislike, agreecomments, disagreecomments} = props;
  const history = useHistory();

  const routeChange = () => {
    history.push('/app/post/'+_id);
  }

  
  useEffect(()=>{
  },[like])
  return (
    <Card md={4} sm={12} xs={12} style={{backGroundColor:'gray'}} elevation={5}>
    <CardActionArea  onClick={()=> {routeChange()}} style={{height:'350px',display:'flex',alignItems:'flex-start'}}>
      <CardContent style={{width:'100%'}}>
        <Typography gutterBottom component="div" style={{color:'#A9A9A9'}}>
          <field>{poster.nickname} </field>
          <field style={{borderRadius: '25'}}>{theme}</field>
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
        {title} 
        </Typography>
        <CardMedia
          component="img"
          height="140"          
          // image={picture[0]} //base64 not convert yet
          image={picture}
          alt="green iguana"
        />
        <Typography variant="body2" color="text.secondary" style={{marginTop:"3%"}}>
          {post_content.slice(0,50)}
          {post_content.length<50?(""):("...")}
        </Typography>
      </CardContent>
    </CardActionArea>
    <Typography variant="body2" color="text.secondary" style={{display:'flow-root',marginRight:'10px', marginTop:'30px',verticalAlign:'bottom'}}>
      <field style={{float:'left', marginLeft:'3%'}}>
        {/* {post_time.split("T")[0]} {post_time.split("T")[1].split(".")[0]} */}
        {post_time.split("T")[0]} {parseInt(post_time.split("T")[1].split(".")[0].split(":")[0]) >15 ? parseInt(post_time.split("T")[1].split(".")[0].split(":")[0])-16:parseInt(post_time.split("T")[1].split(".")[0].split(":")[0])+8}:{post_time.split("T")[1].split(".")[0].split(":")[1]}:{post_time.split("T")[1].split(".")[0].split(":")[2]}
      </field>
      <field style={{float:'right',}}> {like}
      <Checkbox icon={<ThumbUpIcon/>} 
        checkedIcon={<ThumbUpIcon />} 
        checked= {person.like_post.includes(_id)} 
        onChange={(event)=>{
          if(!person.like_post.includes(_id)&&person.dislike_post.includes(_id)){
            editLike({
              post:_id,
              user:person._id,
              type:3,
              status:true,
            })
          }else{
            editLike({
              post:_id,
              user:person._id,
              type:1,
              status:!person.like_post.includes(_id),
            })
          }
        }} 
      />
      {dislike}
      <Checkbox icon={<ThumbDownIcon/>} 
        checkedIcon={<ThumbDownIcon />} 
        checked= {person.dislike_post.includes(_id)} 
        onChange={(event)=>{
          if(!person.dislike_post.includes(_id)&&person.like_post.includes(_id)){
            editLike({
              post:_id,
              user:person._id,
              type:3,
              status:false,
            })
          }else{
            editLike({
              post:_id,
              user:person._id,
              type:2,
              status:!person.dislike_post.includes(_id),
            })
          }
        }} 
      />
      {agreecomments.length + disagreecomments.length}
      <IconButton>
        <MessageIcon/>
      </IconButton></field>
            
    </Typography>
  </Card>
  );
}

