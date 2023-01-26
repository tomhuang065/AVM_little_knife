import React from "react";
import { Button } from "@material-ui/core";
import {
  NotificationsNone as NotificationsIcon,
  ThumbUp as ThumbUpIcon,
  ShoppingCart as ShoppingCartIcon,
  LocalOffer as TicketIcon,
  BusinessCenter as DeliveredIcon,
  SmsFailed as FeedbackIcon,
  DiscFull as DiscIcon,
  Email as MessageIcon,
  Report as ReportIcon,
  Error as DefenceIcon,
  AccountBox as CustomerIcon,
  Done as ShippedIcon,
  Publish as UploadIcon,
  // CancelOutlinedIcon as CancelOutIcon,
} from "@material-ui/icons";
import { useChat } from "../../context/OurContext";
import { useTheme } from "@material-ui/styles";
import classnames from "classnames";
import tinycolor from "tinycolor2";
import {useState, useEffect} from "react";
import { TextField , InputAdornment, IconButton} from "@mui/material";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';


// styles
import useStyles from "./styles";

// components
import { Typography } from "../Wrappers";

const typesIcons = {
  "e-commerce": <ShoppingCartIcon />,
  notification: <NotificationsIcon />,
  offer: <TicketIcon />,
  info: <ThumbUpIcon />,
  message: <MessageIcon />,
  feedback: <FeedbackIcon />,
  customer: <CustomerIcon />,
  shipped: <ShippedIcon />,
  delivered: <DeliveredIcon />,
  defence: <DefenceIcon />,
  report: <ReportIcon />,
  upload: <UploadIcon />,
  disc: <DiscIcon />,
};

export default function Notification({ variant, ...props }) {
  var classes = useStyles();
  var theme = useTheme();
  const [enterBox, setEnterBox] = useState(false)
  const [userColor, setUserColor] = useState("red");
  const [subCommentContent, setSubCommentContent] = useState('');
  const icon = getIconByType(props.type);
  const {sendCreateSubComment, person, subs_in_this_post} = useChat(); //subComment removed


  const iconWithStyles = React.cloneElement(icon, {
    classes: {
      root: classes.notificationIcon,
    },
    style: {
      color:
        variant !== "contained" &&
        theme.palette[props.color] &&
        theme.palette[props.color].main,
    },
  });
  useEffect(()=>{
    if(typeof(props.userColor)!= "undefined"){
      setUserColor(props.userColor)
    }
  }  
  ,[props.userColor])

  useEffect(()=>{
    console.log("subs in this post", subs_in_this_post);
  }, [subs_in_this_post])

  const onSendCreateSubCommentContent = async () => {
    console.log("person: ",person._id);
    if(!subCommentContent ){
        throw console.error("Some field missing");
    }
  
    const payload = {
        user: person._id,
        subcomment_time: new Date(),
        subcomment_content: subCommentContent,
        agreestate: props.agree,
        underComment_id: props.thisComment_id,
        sub_underPost_id :props.thisPost_id
    }
    // setSubs_in_this_post([  ...subs_in_this_post, payload]) //payload doesn't have _id yet, to solve it should set after db resend back to frontend


    sendCreateSubComment(payload);
    setSubCommentContent('');
  }
  return (
    <div>
      <div
        className={classnames(classes.notificationContainer, props.className, {
          [classes.notificationContained]: variant === "contained",
          [classes.notificationContainedShadowless]: props.shadowless,
        })}
        style={{
          backgroundColor:props.color,
        }}
      >
        <div
          className={classnames(classes.notificationIconContainer, {
            [classes.notificationIconContainerContained]: variant === "contained",
            [classes.notificationIconContainerRounded]: variant === "rounded",
          })}
          style={{
            backgroundColor:
              variant === "rounded" &&
              theme.palette[props.color] &&
              tinycolor(theme.palette[props.color].main)
                .setAlpha(0.15)
                .toRgbString(),
          }}
        >
          {iconWithStyles}
        </div>
        <div className={classes.messageContainer} style={{width:'100%'}}>
          <Typography
            style={{color:'black',whiteSpace:'pre-line',width:"100%",wordBreak:'break-all'}}
            variant={props.typographyVariant}
          >
            {props.message}
          </Typography>
          <Button elevation = {5} onClick = {() => setEnterBox(true)} style={{backgorundColor:"#4fca67", color: 'black', height:30, width:"10%", marginLeft:'1%'}}>
            reply
          </Button>
          {props.extraButton && props.extraButtonClick && (
            <Button
              onClick={props.extraButtonClick}
              disableRipple
              className={classes.extraButton}
            >
              {props.extraButton}
            </Button>
          )}
        </div>
      </div>





      {subs_in_this_post.filter(subobj => subobj.underComment_id === props.thisComment_id).map(e => 

      <div
        className={classnames(classes.notificationContainer, props.className, {
          [classes.notificationContained]: variant === "contained",
          [classes.notificationContainedShadowless]: props.shadowless,
        })}
        style={{
          marginLeft :"20%",
          backgroundColor:
          e.agreestate===1?'#3cd4a1':
          e.agreestate===2?'#fdaec9':
          e.agreestate===3?'#bdbdbd':
          e.agreestate===4?'#fcccdd':
          '#9aecd0'
          , width: '80%'
        }}
      >
        <div
          className={classnames(classes.notificationIconContainer, {
            [classes.notificationIconContainerContained]: variant === "contained",
            [classes.notificationIconContainerRounded]: variant === "rounded",
          })}
          style={{
            backgroundColor:
              variant === "rounded" &&
              theme.palette[props.color] &&
              tinycolor(theme.palette[props.color].main)
                .setAlpha(0.15)
                .toRgbString(),
          }}
        >
          {iconWithStyles}
        </div>
        <div className={classes.messageContainer} style={{width:'100%'}}>
          <Typography
            style={{color:'black',whiteSpace:'pre-line',width:"100%",wordBreak:'break-all'}}
            variant={props.typographyVariant}
          >
            {e.subcomment_content}
          </Typography>
        </div>
      </div>)}
      {enterBox? <TextField fullWidth id="fullWidth" size = "small" margin = "dense"
                            value={subCommentContent} 
                            onChange={e => setSubCommentContent(e.target.value)} 
                            style = {{width:"90%", marginLeft:"5%"}}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton aria-label="delete" size="small" onClick = {() => setEnterBox(false)}>
                                    <CancelOutlinedIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton aria-label="delete" size="small">
                                    <SendTwoToneIcon onClick={() => onSendCreateSubCommentContent()}/>
                                  </IconButton>
                               </InputAdornment>
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "&.Mui-focused fieldset": {
                                  borderColor: userColor,
                                  borderWidth: 2
                                }
                              },
                            }}
                            />
      :<div></div> }
    </div>
  );
}
function getIconByType(type = "offer") {
  return typesIcons[type];
}
