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
    const [productAnchor, setProductAnchor] = useState(null);
    const [productSelected, setProductSelected] = useState(-1); //selected index
    const [itemSelected, setItemSelected] = useState(-1); //selected index
    const {sendUpdateProduct, sendCreateProduct, sendFindProductName, sendDeleteProduct, productNames, itemNames, person} = useChat();
    const [errorMessage, setErrorMessage] = useState('');

    const openMenu = (event) => {
        setAnchor(event.currentTarget);
    };
    const openProductMenu = (event) => {
        setProductAnchor(event.currentTarget);
    };
    const closeMenu = () => {
        setAnchor(null);
    };
    const closeProductMenu = () => {
        setProductAnchor(null);
    };
    const onMenuItemClick = (event, index) => {
        setAnchor(null);
        setItemSelected(index);
        
        // setItemName(itemNames[selected].itemname)
        // setItemPrice(itemNames[selected].price)
        // setItemDescription(itemNames[selected].description)

    }
    const onMenuProductClick = (event, index) => {
        setProductAnchor(null);
        setProductSelected(index);
        setItemList([])
        setAmountList([])
    }
    const checkSelectedSubmit = () =>{
        if(productSelected !== -1){
            onSendUpdateProduct();
        }
        else {
            alert("Product not chosen")
        }
    }
    const checkSelectedDelete = () =>{
        if(productSelected !== -1){
            const payload = {
                productname :productNames[productSelected].productname,
                user : person.mail,
            }
            sendDeleteProduct(payload);
            alert(productNames[productSelected].productname+" is deleted")
            setProductSelected(-1)
        }
        else {
            alert("Product not chosen")
        }
    }
    const onSendCreateProduct = async () => {
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
        const payload = {
            user:person.mail, 
            productname : productNames[productSelected].productname,
            newname : productName === ''?productNames[productSelected].productname:productName,
            productprice: productPrice === ''?productNames[productSelected].productprice:productPrice,
            description: productDescription=== ''?productNames[productSelected].description:productDescription,
            itemlist:productNames[productSelected].itemlist,
            amountlist:productNames[productSelected].amountlist,
        }
        console.log(payload)
        sendUpdateProduct(payload);
        setErrorMessage('');
        alert("Product is uploaded");
        setProductName('')
        setProductPrice('')
        setProductDescription('')
        setItemSelected(-1);
        setProductSelected(-1);
            // history.push('/app/dashboard');
    }
    const cleanpage = () =>{
        setRenew(!renew)
        setProductName('')
        setProductPrice('')
        setProductDescription('')
        setItemSelected(-1);
        setProductSelected(-1);
        const payload = {
            user:person.mail,
        }
        sendFindProductName(payload)
    }
    const handleChange = (event) => {
        setTmpItem(event.target.value)
    }
    const getAmount = (event) => {
        if(typeof(event)!== "undefined"){
            setTmpAmount(event.target.value)
        }
        if(renew){
            for(var i = 0; i < productNames[productSelected].itemlist.length; i ++){
                if(tmpItem === productNames[productSelected].itemlist[i]){
                    productNames[productSelected].amountlist[i] = tmpAmount;
                }
            }
        }
        
    }
    const stats = () => {
        for(var i = 0; i < productNames[productSelected].itemlist.length; i ++){
            if(tmpItem === productNames[productSelected].itemlist[i]){
                if(tmpAmount !== 0){
                    alert("New Amount of "+productNames[productSelected].itemlist[i]+ " : "+ tmpAmount)
                }
            }
        }
        
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
        // console.log(productNames[productSelected].amountlist)
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
                                        onClick={openProductMenu}
                                        color="primary"
                                        variant="contained"
                                    >
                                    {productSelected === -1?'Choose Product':productNames[productSelected].productname}
                                    </Button>

                                    <Menu
                                        open={Boolean(productAnchor)}
                                        anchorEl={productAnchor}
                                        onClose={closeProductMenu}
                                        keepMounted
                                    >
                                        {productNames.map((product, index) => (
                                        <MenuItem
                                            key={index}
                                            onClick={(event) => onMenuProductClick(event, index)}
                                            selected= {index === productSelected}
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
                                        {productSelected !== -1? productNames[productSelected].itemlist.map((item, index) => (
                                            <MenuItem
                                                value={item}
                                                key={index}
                                                onClick={(event) => onMenuItemClick(event, index)}
                                                selected= {index === itemSelected}
                                            >
                                                {item}
                                            </MenuItem>
                                        )):null}
                                    </Select>
                                </FormControl>
                                <TextField
                                    style = {{marginLeft:"10px", marginTop:"8px"}}
                                    id="outlined-number"
                                    placeholder="耗用數量"
                                    value ={tmpAmount}
                                    onChange={getAmount}
                                    type="number"
                                />
                                <Button style = {{marginLeft:"20px", marginTop:"20px"}}onClick={() => stats() }>變更耗用數量</Button>
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
                                <Button style = {{marginBottom:"20px", backgroundColor:"blue", color:"white"}}onClick={ () => checkSelectedSubmit() }>Submit</Button>
                                <Button style = {{marginBottom:"20px", marginLeft:"20px", backgroundColor:"red", color:"white"}}onClick={ () => checkSelectedDelete() }>Delete</Button>
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
                                                selected= {index === itemSelected}
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