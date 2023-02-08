import { Box, Button, Grid, Paper, TextField, Menu, MenuItem, Container, Typography ,InputLabel,FormHelperText,FormControl,Select} from "@mui/material";
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
    const date = new Date();
    const [value, setValue] = useState(dayjs(date));
    const [tmpAmount, setTmpAmount] = useState(0);
    const [comment, setComment] = useState('');
    const [anchor, setAnchor] = useState(null); //for menu of item
    const [objAnchor, setObjAnchor] = useState(null); //for menu
    const [selected, setSelected] = useState(-1); //selected index
    const [tmpObj, setTmpObj] = useState('')
    const [objSelected, setObjSelected] = useState(-1)
    const [selectedImage, setSelectedImage] = useState(null);
    const {sendCreatePurchase, sendUpdateItem, person, itemNames, allTheme, jumpDash, setJumpDash, jumpPostId} = useChat();
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (newValue) => {
        setValue(newValue);
        console.log(newValue)
    };
    const handleObjChange = (event) => {
        setTmpObj(event.target.value);
        console.log(tmpObj)
    };
    const openMenu = (event) => {
        setAnchor(event.currentTarget);
    };
    const openObjMenu = (event) => {
        setObjAnchor(event.currentTarget);
    };
    const closeMenu = () => {
        setAnchor(null);
    };
    const onMenuItemClick = (event, index) => {
        setAnchor(null);
        setSelected(index);
    }
    const onMenuObjClick = (event, index) => {
        setObjAnchor(null);
        setObjSelected(index);
    }
    const onSendCreatePurchase = async () => {
        
        const purchasePayload = {
            user:person.mail,
            time: value,
            item:itemNames[selected].itemname,
            amount: tmpAmount,
            comment: comment,
            objective:tmpObj,
            total: itemNames[selected].price*tmpAmount, 
      
        }
        console.log(purchasePayload)
        sendCreatePurchase(purchasePayload);
        const itemPayload = {
            user:person.mail,
            price:itemNames[selected].price,
            itemname:itemNames[selected].itemname,
            // unit:itemNames[selected].unit,
            newname:itemNames[selected].itemname,
            description:itemNames[selected].description,
            amount: itemNames[selected].amount + tmpAmount,
        }
        console.log(itemPayload)
        sendUpdateItem(itemPayload);
        setErrorMessage('');
        alert("Purchase uploaded!");
            // history.push('/app/dashboard');
        setTmpObj('');
        setTmpAmount(0);
        setComment('');
        setSelected(-1);

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
    const getAmount = (event) =>{
        setTmpAmount(event.target.value)
    }
    return (
        // <Box>abcd</Box>
        <>
            <PageTitle title="購原料"/>
            <Paper>
                <Container sx={{bgcolor: '#edfcfa'}}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} style = {{marginLeft:"11px"}}>
                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                <DesktopDatePicker
                                    
                                    label= "Date"
                                    inputFormat="MM/DD/YYYY"
                                    placeholder="date"
                                    value={value}
                                    onChange={handleChange}
                                    renderInput={(params) => <TextField {...params} />}
                                />   
                            </LocalizationProvider>          
                        </Grid>
                        <Grid item xs={12}>
                                <Box style = {{marginLeft:"11px"}}>
                                    <Button
                                        onClick={openMenu}
                                        color="primary"
                                        variant="outlined"
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
                            <TextField
                                style = {{marginLeft:"10px", marginTop:"8px" , width:"270px"}}
                                id="outlined-number"
                                placeholder="耗用數量"
                                onChange={getAmount}
                                value = {tmpAmount}
                                type="number"
                            />
                        </Grid>
                        <Grid item xs={12} >
                            <FormControl sx={{ m: 1, minWidth: 120 }} style = {{width:"270px"}}>
                                <InputLabel style = {{color:"#aeb8b7"}}>價值標的</InputLabel>
                                <Select
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    // value= {selected === -1?'原料名稱':itemNames[selected].itemname}
                                    value = {tmpObj}
                                    label="價值標的"
                                    onClick={openObjMenu}
                                    onChange={handleObjChange}
                                >
                                    {allTheme.map((item, index) => (
                                        <MenuItem
                                            value={item}
                                            key={index}
                                            onClick={(event) => onMenuObjClick(event, index)}
                                            selected= {index === objSelected}
                                        >
                                            {item}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth inputProps={{maxLength:20}} value={comment} placeholder="購買補充" onChange={e => setComment(e.target.value)}/>
                        </Grid>
                        <Grid item xs={12} style = {{marginBottom:"20px"}}>
                            <Button onClick={ () => onSendCreatePurchase()}>Submit</Button>
                            <Typography variant="h5" sx={{color:"red"}}>
                                {errorMessage}
                            </Typography>
                        </Grid>




                    </Grid>
                </Container>
            </Paper>
        </>
        
    );
}