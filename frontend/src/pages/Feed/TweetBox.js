import React, { useState } from "react";
import "./TweetBox.css";
import { Avatar, Button } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import axios from 'axios';
import useLoggedInUser from "../../hooks/useLoggedInUser";
import auth from "../../firebase.init";
import { useAuthState } from 'react-firebase-hooks/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TweetBox = ({ setPosts, updatePosts, retweetImage, setRetweetImage  }) => {
    const [post, setPost] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [loggedInUser] = useLoggedInUser();
    const [user] = useAuthState(auth);
    const email = user?.email;

    
    const userProfilePic = loggedInUser[0]?.profileImage ? loggedInUser[0]?.profileImage : 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png';
    
    const handleUploadImage = (e) => {
        setIsLoading(true);
        const image = e.target.files[0];
        
        const formData = new FormData();
        formData.set('image', image);

        axios.post("https://api.imgbb.com/1/upload?key=c8aec6badf8fbfa65d704e7ade57dcb0", formData)
        .then(res => {
                setImageURL(res.data.data.display_url);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
                })
                }
                
                const handleTweet = (e) => {
                    console.log('Tweet');
                    e.preventDefault();
                    
                    // Check if tweet is empty and no image is uploaded
                    if (!post.trim() && !imageURL && !retweetImage) {
                        toast.error("The tweet cannot be empty!");
                        return;
                    }
                
                    if (user.providerData[0].providerId === 'password') {
                        fetch(`http://localhost:5000/loggodInUser/${email}`)
                            .then(res => res.json())
                            .then(data => {
                                console.log("Fetched user data:", data); // Log fetched user data for debugging
                                setName(data[0]?.name);
                                setUsername(data[0]?.username);
                                submitTweet(); // Call submitTweet function after fetching user data
                            })
                            .catch(error => {
                                console.error("Error fetching user data:", error); // Log error if fetching user data fails
                            });
                    } else {
                        setName(user?.displayName);
                        setUsername(email?.split('@')[0]);
                        submitTweet(); // Call submitTweet function directly if user authentication method is not 'password'
                    }
                };
                
                const submitTweet = () => {
                    console.log("Submitting tweet with user:", name); // Log user name for debugging
                    if (name) {
                        const userPost = {
                            profilePhoto: userProfilePic,
                            username: username,
                            name: name,
                            email: email,
                            post: post,
                            photo: imageURL || retweetImage
                        };
                
                        fetch('http://localhost:5000/post', {
                            method: "POST",
                            headers: {
                                "content-type": "application/json",
                            },
                            body: JSON.stringify(userPost)
                        })
                        .then(res => res.json())
                        .then(data => {
                            setPosts(prevPosts => [data, ...prevPosts]);
                            updatePosts(prevPosts => [data, ...prevPosts]);
                            setPost('');
                            setImageURL('');
                            setRetweetImage(''); // Reset retweetImage state
                            setIsLoading(false);
                        })
                        .catch(error => {
                            console.error("Error submitting tweet:", error); // Log error if submitting tweet fails
                            setIsLoading(false);
                        });
                    }
                };
                
    

    return (
        <div className="tweetBox">
            <form onSubmit={handleTweet}>
                <div className="tweetBox_input" id="top">
                    <Avatar src={userProfilePic} />
                    <input
                        type="text"
                        placeholder="What's happening?"
                        value={post}
                        onChange={(e) => setPost(e.target.value)}
                    />
                </div>
                {imageURL && <img src={imageURL} alt="Uploaded Image" style={{ maxWidth: "100%", height: "50vh" }} />} {/* Apply styles to adjust the size */}
                {retweetImage && !imageURL && <img src={retweetImage} alt="Retweeted Image" style={{ maxWidth: "100%", height: "50vh" }} />} {/* Apply styles to adjust the size */}
                <div className="imageIcon_tweetButton">
                    <label htmlFor='image' className="imageIcon">
                        {
                            isLoading ? <p>Uploading image</p> : <p>{imageURL ? 'image uploaded' : <AddPhotoAlternateOutlinedIcon />}</p>
                        }
                    </label>
                    <input
                        type="file"
                        id='image'
                        className="imageInput" 
                        onChange={handleUploadImage}
                    />
                    <Button
                        className="tweetBox_tweetButton"
                        type="submit">Tweet</Button>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
}

export default TweetBox;
