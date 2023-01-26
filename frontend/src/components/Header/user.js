import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import useStyles from "./styles";
import { useUserDispatch, signOut } from "../../context/UserContext";

export default function User(props,history) {
    const {nickname,introduction,picture} =props;
    var classes = useStyles();
    var userDispatch = useUserDispatch();
  return (
        <Card sx={{ maxWidth: 345 }}>
        <CardMedia
            sx={{ height: 140 }}
            image={picture}
            title="green iguana"
        />
        <CardContent>
            <Typography gutterBottom variant="h5" component="div">
            {nickname}
            </Typography>
            <Typography
                className={classes.profileMenuLink}
                component="a"
                color="primary"
                href="https://youtu.be/dQw4w9WgXcQ"
                >
                Let's rick roll.
            </Typography>
            <Typography variant="body2" color="text.secondary">
            {introduction}
            </Typography>
        </CardContent>
        <CardActions>
            <Button size="small">Share</Button>
            <Button size="small">Learn More</Button>
        </CardActions>
        <div className={classes.profileMenuUser}>
            <Typography
              className={classes.profileMenuLink}
              color="primary"
              onClick={() => signOut(userDispatch,history)}
            >
              Sign Out
            </Typography>
        </div>
        </Card>
    );
}