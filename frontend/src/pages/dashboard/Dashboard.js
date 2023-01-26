import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import {
  Grid,
  Button, 
  CircularProgress, 
  Chip,
  Stack,
} from "@material-ui/core";

// styles
import { useChat } from "../../context/OurContext";
// components
import PageTitle from "../../components/PageTitle";
import Topthree from "./components/Topthree/Topthree";
import Table from "./components/Table/Table";



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
      <PageTitle title={!sort?(`熱門話題`):(`最新話題`)} button={
      <div>
        <Button
          onClick={()=>{setSort(!sort)}}
          variant="contained"
          size="medium"
          color="secondary"
          style = {{backgroundColor : "red",marginLeft:"10%"}} 
    
        >
          {!sort?('最新'):('熱門')}
        </Button >
     </div>} />
     <Grid style = {{marginLeft:"0%"}} >
        <Chip label="*ALL*" onClick={()=>{setSelectTheme('')}} style = {{marginLeft:"3%", marginBottom :"2%"}} variant="outlined" clickable={true} color='secondary'  />
        {allTheme.map(e => (
          <Chip label={e} onClick={()=>{setSelectTheme(e)}} style = {{marginLeft:"3%", marginBottom :"2%"}} variant="outlined" clickable={true} color='primary'  />
        ))}
      {/* </Stack> */}
      </Grid>
      {!sort?(!DashPostsIsLoading||!cir?(
        // hot post have top 3 + table 7
        <Grid container spacing={1} >
       {DashboardPosts.slice(0,3).map(stat => (
          <Grid item md={4} sm={12} xs={12} key={uuidv4()}>
            <Topthree {...stat} />
          </Grid>
        ))}
        <Grid item xs={12} style={{height:'50px'}}>
        </Grid>
        {DashboardPosts.slice(3,show_number).map(stat => (
          <Grid item xs={12} key={uuidv4()}>
            <Table {...stat} />
          </Grid>
        ))}
      </Grid>
      ):<></>
      ):
      //new posts only table 10
      (!DashPostsIsLoading||!cir?(
        <Grid container spacing={1}>
        {DashboardPosts.slice(0,show_number).map(stat => (
          <Grid item xs={12} key={uuidv4()}>
            <Table {...stat} />
          </Grid>
        ))}
      </Grid>
      ):<></>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center", 
          alignItems: "center",
          
        }}
      >
      {DashPostsIsLoading?
        <CircularProgress size={100} />:
        <Button
        style={{
          marginTop:"30px"
        }}
        variant="contained"
        size="medium"
        color="secondary"
        onClick={()=>{sendGetDashboardPosts(sort,show_number,selectTheme,false);}}
      >
        查看更多
      </Button >
      }
      </div> 
    </>
  );
}

