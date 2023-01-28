import { Box, Button, Grid, Paper, TextField, Menu, MenuItem, Container, Typography } from "@mui/material";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useState,useEffect } from "react";
import { useChat } from "../../context/OurContext";
import { useHistory } from "react-router-dom"

export default function CreatePost () {

    const history = useHistory();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [hashtag, setHashtag] = useState('#');
    const [anchor, setAnchor] = useState(null); //for menu
    const [selected, setSelected] = useState(-1); //selected index
    const [selectedImage, setSelectedImage] = useState(null);
    const {sendCreatePost, person, allTheme, jumpDash, setJumpDash, jumpPostId} = useChat();
    const [errorMessage, setErrorMessage] = useState('');
    // const allTheme = [
    //     'Feelings', 'Politics', 'DailyLife'
    // ]
    console.log("in createpost")
    // useEffect(() => {
    //     if(jumpDash === true){
    //         // history.push('/app/post/'+jumpPostId);
    //         history.push('/app/dashboard');
    //         setJumpDash(false);
    //     }
    // }, [jumpDash]);

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
    return (
        // <Box>abcd</Box>
        <>
            <PageTitle title="購入原料"/>
            <Paper>
                <Container sx={{bgcolor: '#edfcfa'}}>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <TextField inputProps={{maxLength:30}} fullWidth value={title} placeholder="Title... " onChange={e => setTitle(e.target.value)}/>                
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth multiline value={content} placeholder="Content... " onChange={e => setContent(e.target.value)}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth inputProps={{maxLength:20}} value={hashtag} placeholder="#Hashtag... " onChange={e => setHashtag(e.target.value)}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Box>
                                <Button
                                    onClick={openMenu}
                                    color="primary"
                                    variant="contained"
                                >
                                {selected === -1?'Choose Theme':allTheme[selected]}
                                </Button>

                                <Menu
                                    open={Boolean(anchor)}
                                    anchorEl={anchor}
                                    onClose={closeMenu}
                                    keepMounted
                                >
                                    {allTheme.map((option, index) => (
                                    <MenuItem
                                        key={index}
                                        onClick={(event) => onMenuItemClick(event, index)}
                                        selected= {index === selected}
                                    >
                                        {option}
                                    </MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <div style ={{marginTop:"2%", marginBottom:"0.5%" ,color:"#838383" , fontFamily:"courier"}}>Please select one image here</div>
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
                            <Button onClick={ () => onSendCreatePost() }>Submit</Button>
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