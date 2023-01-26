import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Modal,
  Box,
  Paper,
  TextField,
  Container,
  Grid,
} from "@material-ui/core";
import {
  Menu as MenuIcon,
  NotificationsNone as NotificationsIcon,
  Person as AccountIcon,
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
} from "@material-ui/icons";

// import Button from '@mui/material/Button';
import classNames from "classnames";

// styles
import useStyles from "./styles";

// components
import { Badge, Typography, Button } from "../Wrappers";
import Notification from "./Notification";

import { useChat } from "../../context/OurContext";
// context
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
} from "../../context/LayoutContext";
import { useUserDispatch, signOut } from "../../context/UserContext";
import rickroll from './rickroll.jpg';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
const notifications = [
  { color: "CommentIcon", message: "Check out this awesome ticket" },
];
export default function Header(props) {
  var {person,editUser,isNotificationsUnread, setIsNotificationsUnread}=useChat();
  var classes = useStyles();

  // global
  var layoutState = useLayoutState();
  var layoutDispatch = useLayoutDispatch();
  var userDispatch = useUserDispatch();
  // local
  var [notificationsMenu, setNotificationsMenu] = useState(null);
  var [profileMenu, setProfileMenu] = useState(null);
  var [isSearchOpen, setSearchOpen] = useState(false);
  var [open,setOpen] = useState(false);


  var [userName,setUserName]=useState('');
  var [userIntro,setUserIntro]=useState('');
  var [userWebPage,setUserWebPage]=useState('');
  var [userImage,setUserImage]=useState('');

  const onEditUser = async () => {
    if(userName!==''){
      const base64 = userImage? await convertToBase64(userImage) : '';
      const payload = {
        oldName:person.nickname,
        newName:userName,
        intro:userIntro,
        image:base64,
        web:userWebPage,
      }
      editUser(payload);
      setOpen(false);
    }
  }

  function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            resolve(fileReader.result);
        };
        fileReader.onerror = (error) => {
            reject(error);
        }
    })
  }

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <IconButton
          color="inherit"
          onClick={() => toggleSidebar(layoutDispatch)}
          className={classNames(
            classes.headerMenuButtonSandwich,
            classes.headerMenuButtonCollapse,
          )}
        >
          {layoutState.isSidebarOpened ? (
            <ArrowBackIcon
              classes={{
                root: classNames(
                  classes.headerIcon,
                  classes.headerIconCollapse,
                ),
              }}
            />
          ) : (
            <MenuIcon
              classes={{
                root: classNames(
                  classes.headerIcon,
                  classes.headerIconCollapse,
                ),
              }}
            />
          )}
        </IconButton>
        <Typography variant="h6" weight="medium" className={classes.logotype}>
          吵架論壇
        </Typography>
        <div className={classes.grow} />
        <IconButton
          color="inherit"
          aria-haspopup="true"
          aria-controls="mail-menu"
          onClick={e => {
            setNotificationsMenu(e.currentTarget);
            setIsNotificationsUnread(false);
          }}
          className={classes.headerMenuButton}
        >
          <Badge
            badgeContent={isNotificationsUnread ? notifications.length : null}
            color="warning"
          >
            <NotificationsIcon classes={{ root: classes.headerIcon }} />
          </Badge>
        </IconButton>
        <IconButton
          aria-haspopup="true"
          color="inherit"
          className={classes.headerMenuButton}
          aria-controls="profile-menu"
          onClick={e => setProfileMenu(e.currentTarget)}
        >
          <AccountIcon classes={{ root: classes.headerIcon }} />
        </IconButton>
        <Menu
          id="notifications-menu"
          open={Boolean(notificationsMenu)}
          anchorEl={notificationsMenu}
          onClose={() => setNotificationsMenu(null)}
          className={classes.headerMenu}
          disableAutoFocusItem
        >
          {person.noti?.map((notification,index) => (
            <MenuItem
              onClick={() => setNotificationsMenu(null)}
              className={classes.headerMenuItem}
              style={{padding:'0'}}
            >
              <Notification {...notification} typographyVariant="inherit" num={index} />
            </MenuItem>
          ))}
        </Menu>
        <Menu
          id="profile-menu"
          open={Boolean(profileMenu)}
          anchorEl={profileMenu}
          onClose={() => setProfileMenu(null)}
          className={classes.headerMenu}
          classes={{ paper: classes.profileMenu }}
          disableAutoFocusItem
        >
          <Card sx={{ maxWidth: 345,border: '2px solid black',maxHeight:800,margin:"0"  }} >
            <CardMedia
                sx={{ height: 140 }}
                image={person.picture?person.picture:rickroll}
                title="green iguana"
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                {person.nickname}
                </Typography>
                <Typography
                    className={classes.profileMenuLink}
                    component="a"
                    color="primary"
                    variant="body2"
                    href={person.self_web?person.self_web:"https://youtu.be/dQw4w9WgXcQ"}
                    >
                    Self website.
                </Typography>
                <hr></hr>
                <Typography variant="body2" color="text.secondary">
                {person.introduction?person.introduction:"no introduction"}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={() => signOut(userDispatch, props.history)} color="primary">
                  sign Out
                </Button>
                <Button size="small" color="primary" onClick={()=>{
                  setUserName(person.nickname);
                  // setUserImage(person.picture);
                  setUserIntro(person.introduction);
                  setUserWebPage(person.self_web);
                  setOpen(true);
                }}>Edit file</Button>
            </CardActions>
            </Card>
        </Menu>
      </Toolbar>
      <Modal
        open={open}
        onClose={()=>{setOpen(false)}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
            <Paper style={{width:"50%",marginLeft:"25%",marginTop:"1%"}}>
            <Typography gutterBottom variant="h3" component="div" style={{marginLeft:"20px"}}>
                Edit self information
                </Typography>
                <Container sx={{bgcolor: '#edfcfa'}}>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                          User name(Max Length:10)
                            <TextField inputProps={{maxLength:10}} fullWidth value={userName} onChange={e => setUserName(e.target.value)}/>                
                        </Grid>
                        <Grid item xs={12}>
                          Self Web
                            <TextField fullWidth multiline value={userWebPage} onChange={e => setUserWebPage(e.target.value)}/>
                        </Grid>
                        <Grid item xs={12}>
                            Self Introduction
                            <TextField fullWidth value={userIntro} onChange={e => setUserIntro(e.target.value)}/>
                        </Grid>
                        <Grid item xs={12}>
                            {userImage && (
                                <Box>
                                    <img alt="not fount" width={"30%"} src={URL.createObjectURL(userImage)} />
                                    <br />
                                    <Button onClick={()=>setUserImage('')}>Remove</Button>
                                </Box>
                            )}
                            <input
                                type="file"
                                name="myImage"
                                onChange={(event) => {
                                    console.log(event.target.files[0]);
                                    setUserImage(event.target.files[0]);
                                }}
                            />
                        </Grid>


                        <Grid item xs={12}>
                            <Button onClick={ () => {onEditUser()} } color="primary">Submit</Button>
                            <Button onClick={ () => {setOpen(false)}} color="primary">Cancel</Button>
                        </Grid>
                    </Grid>
                </Container>
            </Paper>
        </Box>
      </Modal>
    </AppBar>
  );
}

