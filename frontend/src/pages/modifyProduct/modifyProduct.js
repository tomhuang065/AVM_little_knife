import { Box, Button, Grid, Paper, TextField, Menu, MenuItem, Container, Typography,InputLabel,FormHelperText,FormControl,Select } from "@mui/material";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useState,useEffect } from "react";
import { useChat } from "../../context/OurContext";
import { useHistory } from "react-router-dom"

export default function CreatePost () {

    const history = useHistory();
    const [title, setTitle] = useState('');
    const [tmpItem, setTmpItem] = useState('');
    const [tmpAmount, setTmpAmount] = useState(0);
    const [itemList, setItemList] = useState([]);
    const [amountList, setAmountList] = useState([]);
    const [renew, setRenew] = useState(false)
    const [itemName, setItemName] = useState('');
    const [itemPrice, setItemPrice] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [content, setContent] = useState('');
    const [hashtag, setHashtag] = useState('#');
    const [anchor, setAnchor] = useState(null); //for menu
    const [selected, setSelected] = useState(-1); //selected index
    const [selectedImage, setSelectedImage] = useState(null);
    const {sendCreatePost, sendCreateItem, sendUpdateItem, sendDeleteItem, sendFindItemName, itemNames, person, allTheme, jumpDash, setJumpDash, jumpPostId} = useChat();
    const [errorMessage, setErrorMessage] = useState('');

    const openMenu = (event) => {
        sendFindItemName("FindItemName");
        setAnchor(event.currentTarget);
    };
    const closeMenu = () => {
        setAnchor(null);
    };
    const onMenuItemClick = (event, index) => {
        setAnchor(null);
        setSelected(index);
        // setItemName(itemNames[selected].itemname)
        // setItemPrice(itemNames[selected].price)
        // setItemDescription(itemNames[selected].description)

    }
    const checkChoose = () =>{
        if(selected !== -1){
            onSendUpdateItem();
        }
        else {
            alert("Item not chosen")
        }
    }
    const onSendCreateItem = async () => {
        console.log(amountList)
        console.log(itemList)
        if(!itemName === -1 ){
            setErrorMessage("Item name is missing");
            throw console.error("Item name is missing");
        }
        if(!itemPrice === -1 ){
            setErrorMessage("Item Price is missing");
            throw console.error("Item Price is missing");
        }
        console.log(typeof(Number(itemPrice)))
        if(typeof(Number(itemPrice))!== 'number'){
            setErrorMessage("Item Price is not a number");
            alert("Item Price is not a number");
        }
        const payload = {
            itemname :itemName,
            price: itemPrice,
            description: itemDescription,
        }
        console.log(payload)
        // sendCreateItem(payload);
        setErrorMessage('');
        alert("Your post is being uploaded!");
            history.push('/app/dashboard');
    }
    const onSendUpdateItem = async () => {
        if(!itemName === -1 ){
            setErrorMessage("Item name is missing");
            throw console.error("Item name is missing");
        }
        if(!itemPrice === -1 ){
            setErrorMessage("Item Price is missing");
            throw console.error("Item Price is missing");
        }
        if(typeof(Number(itemPrice))!== 'number'){
            setErrorMessage("Item Price is not a number");
            throw console.error("Item Price is not a number");
        }
        console.log(itemName)
        console.log(itemPrice)
        console.log(itemDescription)
        const payload = {
            
            itemname : itemNames[selected].itemname,
            newname : itemName === ''?itemNames[selected].itemname:itemName,
            price: itemPrice === ''?itemNames[selected].price:itemPrice,
            description: itemDescription=== ''?itemNames[selected].description:itemDescription,
        }
        console.log(payload)
        // sendUpdateItem(payload);
        setErrorMessage('');
        alert("Item is uploaded");
        setItemName('')
        setItemPrice('')
        setItemDescription('')
            // history.push('/app/dashboard');
    }
    const cleanpage = () =>{
        setRenew(!renew)
        setItemName('')
        setItemPrice('')
        setItemDescription('')
        sendFindItemName("FindItemName");
    }
    const handleChange = (event) => {
        setTmpItem(event.target.value)
    }
    const getAmount = (event) => {
        setTmpAmount(event.target.value)
    }

    const addNewItem = () => {
        if(tmpItem === ''){
            alert("Item is missing")
        }
        if(tmpAmount === ''){
            alert("Amount is missing")
        }
        if(tmpItem !== '' && tmpAmount !== ''){
            setItemList([].concat(itemList, tmpItem))
            setAmountList([].concat(amountList, tmpAmount))
        }
        setTmpItem('');
        setTmpAmount('')
    }
    return (
        <>
            <PageTitle title={renew? "變更產品資訊": "新增產品資訊"}
                button={
                    <div>
                        <Button
                        onClick={()=>{cleanpage()}}
                        variant="contained"
                        variant="outlined" 
                        color="secondary"
                        style = {{backgroundColor : "blue",marginRight:"10%", width:"150px", color :"white", height:"50px" ,borderRadius:"10px"}} 
                        >
                        {!renew?('變更產品資訊'):('新增產品資訊')}
                        </Button >
                    </div>
                }
            />
            {renew? 
                <Paper>
                    <Container sx={{bgcolor: '#edfcfa'}} style={{width:"100%"}}>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <Box>
                                    <Button
                                        onClick={openMenu}
                                        color="primary"
                                        variant="contained"
                                    >
                                    {selected === -1?'Choose Item':itemNames[selected].itemname}
                                    </Button>

                                    <Menu
                                        open={Boolean(anchor)}
                                        anchorEl={anchor}
                                        onClose={closeMenu}
                                        keepMounted
                                    >
                                        {itemNames.map((item, index) => (
                                        <MenuItem
                                            key={index}
                                            onClick={(event) => onMenuItemClick(event, index)}
                                            selected= {index === selected}
                                        >
                                            {item.itemname}
                                        </MenuItem>
                                        ))}
                                    </Menu>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth  inputProps={{maxLength:30}}  value={itemName} placeholder="新名稱" onChange={e => setItemName(e.target.value)}/>                
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth value={itemPrice} placeholder="新價格（輸入阿拉伯數字）" onChange={e => setItemPrice(e.target.value)}/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth multiline inputProps={{maxLength:50}} value={itemDescription} placeholder="新描述" onChange={e => setItemDescription(e.target.value)}/>
                            </Grid>
                            <Grid item xs={12}>
                                <Button style = {{marginBottom:"20px", backgroundColor:"blue", color:"white"}}onClick={ () => checkChoose() }>Submit</Button>
                                {/* <Button style = {{marginBottom:"20px", marginLeft:"20px", backgroundColor:"blue", color:"white"}}onClick={() => sendDeleteItem(itemNames[selected].itemname)}>Delete</Button>    */}
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
                                <TextField inputProps={{maxLength:30}} fullWidth value={itemName} placeholder="產品名稱" onChange={e => setItemName(e.target.value)}/>                
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth value={itemPrice} placeholder="產品價格（輸入阿拉伯數字）" onChange={e => setItemPrice(e.target.value)}/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth multiline inputProps={{maxLength:50}} value={itemDescription} placeholder="產品敘述" onChange={e => setItemDescription(e.target.value)}/>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl sx={{ m: 1, minWidth: 120 }} >
                                    <InputLabel id="demo-simple-select-helper-label"></InputLabel>
                                    <Select
                                        labelId="demo-simple-select-helper-label"
                                        id="demo-simple-select-helper"
                                        // value= {selected === -1?'原料名稱':itemNames[selected].itemname}
                                        value = {tmpItem}
                                        placeholder="原料名稱"
                                        // label="原料名稱"
                                        onChange={handleChange}
                                    >
                                        {itemNames.map((item, index) => (
                                            <MenuItem
                                                value={item.itemname}
                                                key={index}
                                                onClick={(event) => onMenuItemClick(event, index)}
                                                selected= {index === selected}
                                            >
                                                {item.itemname}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                    style = {{marginLeft:"10px", marginTop:"8px"}}
                                    id="outlined-number"
                                    placeholder="耗用數量"
                                    onChange={getAmount}
                                    type="number"
                                />
                                <Button style = {{marginLeft:"20px", marginTop:"20px"}}onClick={ () => addNewItem() }>新增原料</Button>
                            </Grid>
                            <Grid item xs={12}>
                                {itemList.map((item) => ( 
                                    <div>{item}</div>
                                ))}
                                {amountList.map((amount) => ( 
                                    <div>{amount}</div>
                                ))}
                            </Grid>
                            <Grid item xs={12}>
                                <Button style = {{backgroudColor:"#e5e5e5", marginTop: "10px"}}onClick={ () => onSendCreateItem() }>Submit</Button>
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