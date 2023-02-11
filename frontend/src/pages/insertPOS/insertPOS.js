import { Box, Button, Grid, Paper, TextField, Menu, MenuItem, Container, Typography } from "@mui/material";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useState,useEffect } from "react";
import { useChat } from "../../context/OurContext";
import { useHistory } from "react-router-dom"
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export default function CreatePost () {

    const history = useHistory();
    var [sort, setSort] = useState(false); 
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [hashtag, setHashtag] = useState('#');
    const [anchor, setAnchor] = useState(null); //for menu
    const [selected, setSelected] = useState(-1); //selected index
    const [selectedImage, setSelectedImage] = useState(null);
    const {sendCreatePost, sendFindProductName, sendCreateProfit, sendUpdateItem, person, allTheme, productNames, itemNames, jumpDash, setJumpDash, jumpPostId} = useChat();
    const [errorMessage, setErrorMessage] = useState('');
    // const allTheme = [
    //     'Feelings', 'Politics', 'DailyLife'
    // ]
    // useEffect(() => {
    //     if(jumpDash === true){
    //         // history.push('/app/post/'+jumpPostId);
    //         history.push('/app/dashboard');
    //         setJumpDash(false);
    //     }
    // }, [jumpDash]);
    const date = new Date();
    // console.log(date)
    const [time, setTime] = useState(dayjs(date));

    const handleChange = (newValue) => {
        setTime(newValue);
    };

    const openMenu = (event) => {
        setAnchor(event.currentTarget);
        const payload = {
            user:person.mail,
        }
        // console.log(payload)
        sendFindProductName(payload);    
    };
    // const showproduct = () => {
    //     setShowProduct(!showProduct)
    //     const payload = {
    //         user:person.mail,
    //     }
    //     // console.log(payload)
    //     sendFindProductName(payload);    
    // }
    const closeMenu = () => {
        setAnchor(null);
    };
    const onMenuItemClick = (event, index) => {
        setAnchor(null);
        setSelected(index);
    }
    const onSendCreateProfit = async () => {
        
        const payload = {
            productname:productNames[selected].productname,
            total: Number(productNames[selected].productprice)*Number(amount),
            amount:amount,
            time:time,
            description:description,
            user:person.mail,
        }
        console.log(payload)
        sendCreateProfit(payload);
        setErrorMessage('');
        // alert("Your post is being uploaded!");
        //     history.push('/app/dashboard');
            // setTitle('');
        // setContent('');
        // setHashtag('#');
        // setSelected(-1);
        // setSelectedImage(null);

    }
    const dealItem = async () =>{
        for(var i = 0; i < productNames[selected].itemlist.length; i++){
            for(var j = 0; j < itemNames.length; j++){
                if(productNames[selected].itemlist[i] === itemNames[j].itemname){
                    const payload = {
                        itemname:itemNames[j].itemname,
                        price:itemNames[j].price,
                        amount:Number(itemNames[j].amount) - Number(productNames[selected].amountlist[i]),
                        unit:itemNames[j].unit,
                        user:person.mail,
                    }
                    console.log(payload)
                    sendUpdateItem(payload)
                }
            }
        }
    }

    const checkclick = () =>{
        setSort(!sort)
        console.log("clicked")
        console.log(sort)
    }
    const checkSelected = () =>{
        if(selected !== -1){
            dealItem()
            onSendCreateProfit()
        }
    }
    return (
        // <Box>abcd</Box>
        <>
            <PageTitle title="上傳POS機資料" 
                button={
                    <div>
                        <Button
                        onClick={()=>{checkclick()}}
                        variant="contained"
                        // size="large"
                        variant="outlined" 
                        // sx={{ width: 200, padding: 1, margin: 2 }}
                        color="secondary"
                        style = {{backgroundColor : "blue",marginRight:"10%", width:"100px", color :"white", height:"50px" ,borderRadius:"10px"}} 
                        >
                        {!sort?('手動輸入'):('檔案上傳')}
                        </Button >
                    </div>
                }
            />
            {!sort === true? 
                <Paper >
                    <Container sx={{bgcolor: '#edfcfa'}}>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <Box>
                                    <Button
                                        onClick={openMenu}
                                        color="primary"
                                        variant="outlined"
                                    >
                                    {selected === -1?'Choose Product':productNames[selected].productname}
                                    </Button>

                                    <Menu
                                        open={Boolean(anchor)}
                                        anchorEl={anchor}
                                        onClose={closeMenu}
                                        keepMounted
                                    >
                                        {productNames.map((product, index) => (
                                        <MenuItem
                                            key={index}
                                            onClick={(event) => onMenuItemClick(event, index)}
                                            selected= {index === selected}
                                        >
                                            {product.productname}
                                        </MenuItem>
                                        ))}
                                    </Menu>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DesktopDatePicker
                                        label= "Date"
                                        inputFormat="MM/DD/YYYY"
                                        placeholder="date"
                                        value={time}
                                        onChange={handleChange}
                                        renderInput={(params) => <TextField {...params} />}
                                    />   
                                </LocalizationProvider>          
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth multiline value={amount} placeholder="Amount " onChange={e => setAmount(e.target.value)}/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth multiline value={description} placeholder="Description " onChange={e => setDescription(e.target.value)}/>
                            </Grid>
                            <Grid item xs={12}>
                                {/* onClick = {() => onSendCreatePost()} */}
                                <Button style = {{marginBottom:"20px" , color:"blue"}} onClick={() => checkSelected()} >Submit</Button>
                                <Typography variant="h5" sx={{color:"red"}}>
                                    {errorMessage}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Container>
                </Paper>
                :
                <Paper>
                <Container sx={{bgcolor: '#edfcfa'}}>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <div style ={{marginTop:"2%", marginBottom:"0.5%" ,color:"#838383" , fontFamily:"courier"}}>Acceptable format : .xlsx or .csv</div>
                            {selectedImage && (
                                <Box >
                                    
                                    <img alt="not fount" width={"1024px"} src={URL.createObjectURL(selectedImage)} />
                                    <br />
                                    <Button onClick={()=>setSelectedImage(null)}>Remove</Button>
                                </Box>
                            )}
                            {/* <br />
                            
                            <br />  */}
                            <input
                                type="file"
                                name="myImage"
                                onChange={(event) => {
                                    console.log(event.target.files[0]);
                                    setSelectedImage(event.target.files[0]);
                                }}
                            />
                        </Grid>


                        <Grid item xs={12}>
                            {/* onClick={ () => onSendCreatePost() } */}
                            <Button style = {{marginBottom:"20px", color:"blue"}} onClick={()=>console.log("clicked")}>Submit</Button> 
                            <Typography variant="h5" sx={{color:"red"}}>
                                {errorMessage}
                            </Typography>
                        </Grid>




                    </Grid>
                </Container>
            </Paper>
            }
            
        </>
        
    );
}