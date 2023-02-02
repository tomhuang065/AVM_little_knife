import { Box, Button, Grid, Paper, TextField, Menu, MenuItem, Container, Typography } from "@mui/material";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useState,useEffect } from "react";
import { useChat } from "../../context/OurContext";
import { useHistory } from "react-router-dom"

export default function CreatePost () {

    const history = useHistory();
    const [title, setTitle] = useState('');
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
    const checkSelectedSubmit = () =>{
        if(selected !== -1){
            onSendUpdateItem();
        }
        else {
            alert("Item not chosen")
        }
    }
    const checkSelectedDelete = () =>{
        if(selected !== -1){
            sendDeleteItem(itemNames[selected].itemname);
            alert(itemNames[selected].itemname, "is deleted")
            setSelected(-1)
        }
        else {
            alert("Item not chosen")
        }
    }
    const onSendCreateItem = async () => {
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
            user:person.mail,
            itemname :itemName,
            price: itemPrice,
            description: itemDescription,
        }
        console.log(payload)
        sendCreateItem(payload);
        cleanpage();
        setErrorMessage('');
        alert("Item is created!");
        setItemName('')
        setItemPrice('')
        setItemDescription('')
            // history.push('/app/dashboard');
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
            user:person.mail,
            itemname : itemNames[selected].itemname,
            newname : itemName === ''?itemNames[selected].itemname:itemName,
            price: itemPrice === ''?itemNames[selected].price:itemPrice,
            description: itemDescription=== ''?itemNames[selected].description:itemDescription,
        }
        console.log(payload)
        sendUpdateItem(payload);
        cleanpage();
        // setRenew(!renew)
        setErrorMessage('');
        alert("Item is uploaded");
        setSelected(-1);
        setItemName('')
        setItemPrice('')
        setItemDescription('')
            // history.push('/app/dashboard');
    }
    const cleanpage = () =>{
        // setRenew(!renew)
        setItemName('')
        setItemPrice('')
        setItemDescription('')
        const payload = {
            user:person.mail,
        }
        sendFindItemName(payload);
     
    }

    return (
        <>
            <PageTitle title={renew? "變更原料資訊": "新增原料資訊"}
                button={
                    <div>
                        <Button
                        onClick={()=>{cleanpage()}}
                        variant="contained"
                        variant="outlined" 
                        color="secondary"
                        style = {{backgroundColor : "blue",marginRight:"10%", width:"150px", color :"white", height:"50px" ,borderRadius:"10px"}} 
                        >
                        {!renew?('變更原料資訊'):('新增原料資訊')}
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
                                <TextField inputProps={{maxLength:30}} fullWidth value={itemName} placeholder="New item name ..." onChange={e => setItemName(e.target.value)}/>                
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth value={itemPrice} placeholder="Item Price (Enter Number) " onChange={e => setItemPrice(e.target.value)}/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth multiline inputProps={{maxLength:50}} value={itemDescription} placeholder="Item Description... " onChange={e => setItemDescription(e.target.value)}/>
                            </Grid>
                            <Grid item xs={12}>
                                <Button style = {{marginBottom:"20px", backgroundColor:"blue", color:"white"}}onClick={ () => checkSelectedSubmit() }>Submit</Button>
                                <Button style = {{marginBottom:"20px", marginLeft:"20px", backgroundColor:"red", color:"white"}} onClick={() => checkSelectedDelete() }>Delete</Button>   
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
                                <TextField inputProps={{maxLength:30}} fullWidth value={itemName} placeholder="Item Name ..." onChange={e => setItemName(e.target.value)}/>                
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth value={itemPrice} placeholder="Item Price (Enter Number) " onChange={e => setItemPrice(e.target.value)}/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth multiline inputProps={{maxLength:50}} value={itemDescription} placeholder="Item Description... " onChange={e => setItemDescription(e.target.value)}/>
                            </Grid>
                            <Grid item xs={12}>
                                <Button style = {{marginBottom:"20px"}}onClick={ () => onSendCreateItem() }>Submit</Button>
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