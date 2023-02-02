import { Box, Button, Grid, Paper, TextField, Menu, MenuItem, Container, Typography } from "@mui/material";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useState,useEffect } from "react";
import { useChat } from "../../context/OurContext";
import { useHistory } from "react-router-dom"

export default function CreatePost () {

    const history = useHistory();
    const [title, setTitle] = useState('');
    const [showItem, setShowItem] = useState(false);
    const [showProduct, setShowProduct] = useState(false);
    const [content, setContent] = useState('');
    const [hashtag, setHashtag] = useState('#');
    const [anchor, setAnchor] = useState(null); //for menu
    const [selected, setSelected] = useState(-1); //selected index
    const [selectedImage, setSelectedImage] = useState(null);
    const {sendCreatePost, person, allTheme, sendFindItemName, sendFindProductName, itemNames, productNames, jumpDash, setJumpDash, jumpPostId} = useChat();
    const [errorMessage, setErrorMessage] = useState('');
    // console.log("in createpost")

    useEffect(()=>{

        console.log(showItem)
    }
    ,[showItem])
    const openMenu = (event) => {
        setAnchor(event.currentTarget);
    };
    const closeMenu = () => {
        setAnchor(null);
    };
    const onMenuItemClick = (event, index) => {
        setAnchor(null);
        setSelected(index);
    }
    const onSendCreatePost = async () => {
        console.log("person: ",person._id);
        if(!title || !content || selected === -1 ){
            setErrorMessage("Some field missing");
            throw console.error("Some field missing");
        }
        const base64 = selectedImage? await convertToBase64(selectedImage) : '';
        console.log("img base64: ", base64);
        const payload = {
            poster: person._id,
            title: title,
            post_time: new Date(),
            post_content: content,
            theme: allTheme[selected],
            picture: base64,
            like:0,
            dislike:0,
            commentcount:0
        }
        sendCreatePost(payload);
        setErrorMessage('');
        alert("Your post is being uploaded!");
            history.push('/app/dashboard');
            // setTitle('');
        // setContent('');
        // setHashtag('#');
        // setSelected(-1);
        // setSelectedImage(null);

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
    const showitem = () => {
        setShowItem(!showItem)
        const payload = {
            user:person.mail,
        }
        // console.log(payload)
        sendFindItemName(payload); 
           
    }

    const showproduct = () => {
        setShowProduct(!showProduct)
        const payload = {
            user:person.mail,
        }
        // console.log(payload)
        sendFindProductName(payload);    
    }
    return (
        <>
            <PageTitle title="庫存"
                button={
                    <div>
                         <div>
                            <Button
                            onClick={()=>{showitem()}}
                            variant="contained"
                            variant="outlined" 
                            color="secondary"
                            style = {{backgroundColor : "blue",marginRight:"10%", width:"150px", color :"white", height:"50px" ,borderRadius:"10px"}} 
                            >
                            {!showItem?('顯示庫存'):('隱藏庫存')}
                            </Button >
                        </div>
                        <div>
                            <Button
                            onClick={()=>{showproduct()}}
                            variant="contained"
                            variant="outlined" 
                            color="secondary"
                            style = {{backgroundColor : "blue",marginRight:"10%", marginTop:"20px", width:"150px", color :"white", height:"50px" ,borderRadius:"10px"}} 
                            >
                            {!showProduct?('顯示產品'):('隱藏產品')}
                            </Button >
                        </div>
                    </div>
                   
                }
            />
            {/* <div>{itemNames}</div> */}
            {showItem?
                <div>
                {itemNames.map((item, index) => (
                    <div>Item Name : {item.itemname}   Item Amount:{item.amount} Item Price:{item.price}  Item Description:{item.description}</div>
                ))}
            </div>:
            <div></div>
            // use a mui table here
            }
            {/* <div>{itemNames}</div> */}
            {showProduct?
                <div>
                {productNames.map((product, index) => (
                    <div>Prodcut Name : {product.productname}   Product price:{product.productprice}  Product Description:{product.description} Items used:{product.itemlist} Amount used:{product.amountlist}</div>
                ))}
            </div>:
            <div></div>
            // use a mui table here
            }
            
        </>
        
    );
}