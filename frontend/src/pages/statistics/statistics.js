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
import { ContactlessOutlined } from "@material-ui/icons";
// import Topthree from "./components/Topthree/Topthree";
// import Table from "./components/Table/Table";



export default function Dashboard (props) {
  // local
  var [sort, setSort] = useState(false); //false: hot, true: new
  const [selectTheme, setSelectTheme] = useState(''); //'': all
  const [positive, setPositive] = useState(0);
  const [neg, setNeg] = useState(0);
  const [total, setTotal] = useState(0);


  const {sendGetPurchases,  profitNames, sendGetProfits, purchaseNames,setDashboardPosts ,person, currentLocation,show_number,setShow_number, allTheme,DashPostsIsLoading, cir} = useChat();
  useEffect(()=>{
    if(currentLocation === '/app/statistics'){
      setDashboardPosts([]);
      setShow_number(0);
      const payload = {
          user:person.mail,
      }
      sendGetPurchases(payload);
      sendGetProfits(payload)
    }
  }, [currentLocation]);
  useEffect(()=>{
      console.log(purchaseNames)
    if(purchaseNames.length !== 0){
      findTotal();
    }
  }, [purchaseNames, profitNames]);

  const findTotal = () => {
    var temp = 0;
    for(var i = 0; i < purchaseNames.length; i ++){
        temp -= purchaseNames[i].total
            console.log(temp)        
    }
    for(var i = 0; i < profitNames.length; i ++){
      temp -= profitNames[i].total
          console.log(temp)        
  }
    setNeg(temp)
  }
//   console.log("get post", DashboardPosts)
  // console.log("All theme", allTheme)
  return (
    <>
      <PageTitle title="統計與報表"></PageTitle>
      <Grid container  style = {{ width:"100%", backgroundColor:"#000000", height:"100%"}} >
        <Paper elevation = {10} style = {{ width:"100%", backgroundColor:"#ffffff",  height:"100%"}}>
          <Grid item xs={12}>
            {purchaseNames.length !== 0?
                <div>
                    {purchaseNames.map(purchase =>(
                        <div>{purchase.item} : - {purchase.total}</div>
                    ))}
                </div>
                :
                <div></div>
            }
          </Grid>
          <Grid item xs={12}>
            {profitNames.length !== 0?
                <div>
                    {profitNames.map(profit =>(
                        <div>{profit.productname} : +{profit.total}</div>
                    ))}
                </div>
                :
                <div></div>
            }
          </Grid>
          <Grid item xs={12}>
            <div>total:{neg}</div>
          </Grid>
        </Paper>
      </Grid>
    </>
  );
}

