import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import {
  Grid,
  Button, 
  CircularProgress, 
  Chip,
  Stack,
  Box,
  Typography,
  Paper,
} from "@material-ui/core";

// styles
import { useChat } from "../../context/OurContext";
// components
import PageTitle from "../../components/PageTitle";
// import Topthree from "./components/Topthree/Topthree";
// import Table from "./components/Table/Table";



export default function Dashboard (props) {
  // local
  var [sort, setSort] = useState(false); //false: hot, true: new
  const [selectTheme, setSelectTheme] = useState(''); //'': all


  const {sendGetDashboardPosts,  DashboardPosts,setDashboardPosts ,currentLocation,show_number,setShow_number, allTheme,DashPostsIsLoading, cir} = useChat();
  useEffect(()=>{
    if(currentLocation === '/app/dashboard'){
      setDashboardPosts([]);
      setShow_number(0);
      sendGetDashboardPosts(sort, 0, selectTheme,true);
    }
  }, [currentLocation,sort,selectTheme]);
  console.log("get post", DashboardPosts)
  // console.log("All theme", allTheme)
  return (
    <>
      <PageTitle title="統計與報表"></PageTitle>
      <Grid container  style = {{ width:"100%", backgroundColor:"#000000", height:"100%"}} >
        <Paper elevation = {10} style = {{ width:"100%", backgroundColor:"#ffffff",  height:"100%"}}>
          <Grid container spacing = {2}>
            <Paper elevation = {5} style = {{marginTop:"50px" ,marginLeft:"50px",marginRight:"50px", width : "100%", height:"300px", backgroundColor:"#f5f5f5"}} >智慧小刀介紹</Paper>
          </Grid>
          <Grid container spacing = {2}>
            <Paper elevation = {5} style = {{marginTop:"50px" ,marginLeft:"50px",marginRight:"50px", width : "100%", height:"300px", backgroundColor:"#f5f5f5"}} >使用說明</Paper>
          </Grid>
          <Grid container spacing = {2}>
            <Paper elevation = {5} style = {{marginTop:"50px" ,marginLeft:"50px",marginRight:"50px", width : "100%", height:"300px", backgroundColor:"#f5f5f5"}} >與我們聯絡</Paper>
          </Grid>
        </Paper>
      </Grid>
    </>
  );
}

