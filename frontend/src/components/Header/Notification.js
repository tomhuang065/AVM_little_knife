import React from "react";
import CommentIcon from '@mui/icons-material/Comment';
import ReplyIcon from '@mui/icons-material/Reply';
import { useHistory } from "react-router-dom";


// styles


const typesIcons = {
  CommentIcon: <CommentIcon />,
  ReplyIcon: <ReplyIcon />,
};

export default function Notification({ variant, ...props }) {
  const history = useHistory();
  const {message,icon,num,id}=props
  const routeChange = () => {
    history.push('/app/post/'+id);
  }
  var c=num%2===0?"#e3e6e8":"white"
  return (
    <div style={{backgroundColor:c,width:"100%",height:"100%",padding:"10px"}} onClick={()=>{routeChange()}}>
      <field style={{color:"red"}}>{getIconByType(icon)}</field>
      <field>{message}</field>
    </div>
  );
}
function getIconByType(icon = "offer") {
  return typesIcons[icon];
}
