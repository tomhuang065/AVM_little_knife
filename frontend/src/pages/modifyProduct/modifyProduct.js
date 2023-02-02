import { Box, Button, Grid, Paper, TextField, Menu, MenuItem, Container, Typography,InputLabel,FormHelperText,FormControl,Select } from "@mui/material";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useState,useEffect } from "react";
import { useChat } from "../../context/OurContext";
import { useHistory } from "react-router-dom"

export default function CreatePost () {

    const history = useHistory();
    const [tmpItem, setTmpItem] = useState('');
    const [tmpAmount, setTmpAmount] = useState(0);
    const [itemList, setItemList] = useState([]);
    const [amountList, setAmountList] = useState([]);
    const [renew, setRenew] = useState(false)
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [anchor, setAnchor] = useState(null); //for menu
    const [selected, setSelected] = useState(-1); //selected index
    const {sendCreatePost, sendCreateProduct, sendFindProductName, productNames, itemNames, person} = useChat();
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
    const checkChoose = () =>{
        if(selected !== -1){
            onSendUpdateProduct();
        }
        else {
            alert("Item not chosen")
        }
    }
    const onSendCreateProduct = async () => {
        // const payload = {
        //     user:person.mail,
        // }
        // sendFindItemName(payload);
        // console.log(amountList)
        // console.log(itemList)
        if(productName === '' || productPrice === '' ){
            setErrorMessage("Product name or product price is missing");
            throw console.error("Product name or product priceis missing");
        }
        if(itemList === [] || amountList === []){
            setErrorMessage("Item or amount is missing");
            throw console.error("Item or amount is missing");
        }
        
        const payload = {
            
            productname :productName,
            productprice: productPrice,
            description: productDescription,
            itemlist:itemList,
            amountlist:amountList,
            user:person.mail,
        }
        console.log(payload)
        if(productName !== '' && productPrice !== '' && itemList !== [] && amountList !== []){
                    sendCreateProduct(payload);
        }

        setErrorMessage('');
        setProductName('')
        setProductPrice('')
        setProductDescription('')
        setItemList([])
        setAmountList([])
        alert("Product is created!");
            // history.push('/app/dashboard');
    }
    const onSendUpdateProduct = async () => {
        // if(!itemName === -1 ){
        //     setErrorMessage("Item name is missing");
        //     throw console.error("Item name is missing");
        // }
        // if(!itemPrice === -1 ){
        //     setErrorMessage("Item Price is missing");
        //     throw console.error("Item Price is missing");
        // }
        // if(typeof(Number(itemPrice))!== 'number'){
        //     setErrorMessage("Item Price is not a number");
        //     throw console.error("Item Price is not a number");
        // }
        const payload = {
            user:person.mail, 
            productname : productNames[selected].productname,
            newname : productName === ''?productNames[selected].productname:productName,
            productprice: productPrice === ''?productNames[selected].productprice:productPrice,
            description: productDescription=== ''?productNames[selected].description:productDescription,
            // itemlist:,
            // amountlist:,
            // 修好下拉市選單機制
        }
        console.log(payload)
        // sendUpdateItem(payload);
        setErrorMessage('');
        alert("Product is uploaded");
        setProductName('')
        setProductPrice('')
        setProductDescription('')
            // history.push('/app/dashboard');
    }
    const cleanpage = () =>{
        setRenew(!renew)
        setProductName('')
        setProductPrice('')
        setProductDescription('')
        const payload = {
            user:person.mail,
        }
        sendFindProductName(payload)
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
                    <Container sx={{bgcolor: '#edfcfa'}}>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <Box>
                                    <Button
                                        onClick={openMenu}
                                        color="primary"
                                        variant="contained"
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
                                <TextField inputProps={{maxLength:30}} fullWidth value={productName} placeholder="新名稱" onChange={e => setProductName(e.target.value)}/>                
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth value={productPrice} placeholder="新價格（輸入阿拉伯數字）" onChange={e => setProductPrice(e.target.value)}/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth multiline inputProps={{maxLength:50}} value={productDescription} placeholder="新敘述" onChange={e => setProductDescription(e.target.value)}/>
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
                                        onClick={openMenu}
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
                                <Button style = {{backgroudColor:"#e5e5e5", marginTop: "10px"}}onClick={ () => onSendCreateProduct() }>Submit</Button>
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
                                <TextField inputProps={{maxLength:30}} fullWidth value={productName} placeholder="產品名稱" onChange={e => setProductName(e.target.value)}/>                
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth value={productPrice} placeholder="產品價格（輸入阿拉伯數字）" onChange={e => setProductPrice(e.target.value)}/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth multiline inputProps={{maxLength:50}} value={productDescription} placeholder="產品敘述" onChange={e => setProductDescription(e.target.value)}/>
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
                                        onClick={openMenu}
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
                                <Button style = {{backgroudColor:"#e5e5e5", marginTop: "10px"}}onClick={ () => onSendCreateProduct() }>Submit</Button>
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