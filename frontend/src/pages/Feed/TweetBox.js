import React, { useState } from "react";
import "./TweetBox.css";
import { Avatar, Button } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import useLoggedInUser from "../../hooks/useLoggedInUser";
import auth from "../../firebase.init";
import { useAuthState } from 'react-firebase-hooks/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TweetBox = ({ setPosts, updatePosts, retweetImage, setRetweetImage }) => {
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
            });
    };
                
    const handleTweet = async (e) => {
        console.log('Tweet');
        e.preventDefault();
        
        if (!post.trim() && !imageURL && !retweetImage) {
            toast.error("The tweet cannot be empty!");
            return;
        }

        if (user.providerData[0].providerId === 'password') {
            try {
                const response = await fetch(`http://localhost:5000/loggodInUser/${email}`);
                const data = await response.json();
                console.log("Fetched user data:", data);
                const fetchedName = data[0]?.name;
                const fetchedUsername = data[0]?.username;
                setName(fetchedName);
                setUsername(fetchedUsername);
                submitTweet(fetchedName, fetchedUsername);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        } else {
            const displayName = user?.displayName;
            const userUsername = email?.split('@')[0];
            setName(displayName);
            setUsername(userUsername);
            submitTweet(displayName, userUsername);
        }
    };
    
    const submitTweet = (name, username) => {
        console.log("Submitting tweet with user:", name, username);
        if (email) {
            console.log(name)
            const userPost = {
                profilePhoto: userProfilePic,
                username: username,
                name: name,
                email: email,
                post: post,
                photo: imageURL || retweetImage,
                likes: { type: [String], default: [] },
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
                setPosts(prevPosts => [userPost, ...prevPosts]);
                updatePosts(prevPosts => [userPost, ...prevPosts]);
                setPost('');
                setImageURL('');
                setRetweetImage('');
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error submitting tweet:", error); 
                setIsLoading(false);
            });
        }
    };

    const handleCancelRetweetImage = () => {
        setRetweetImage('');
        setImageURL('');
    };

    return (
        <div className="tweetBox">
            <form onSubmit={handleTweet}>
                <div className="tweetBox_input" id="top">
                    <Avatar src={userProfilePic} />
                    <input
                        type="text"
                        placeholder="Comment"
                        value={post}
                        onChange={(e) => setPost(e.target.value)}
                    />
                </div>
                {imageURL && (
                    <div className="image-preview">
                          <div className="cancelIcon-Cover">
                          <CancelIcon className="cancel-icon" onClick={handleCancelRetweetImage} />
                        </div>
                        <img src={imageURL} alt="Uploaded Image" style={{ maxWidth: "100%", height: "50vh" }} />
                    </div>
                )}
                {retweetImage && (
                    <div className="retweet-image-preview">
                        <div className="cancelIcon-Cover">
                        <CancelIcon className="cancel-icon" onClick={handleCancelRetweetImage} />
                        </div>
                        <img src={retweetImage} alt="Retweet Image" style={{ maxWidth: "100%", height: "50vh" }} />
                    </div>
                )}
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
                        type="submit">Post</Button>
                </div>
            <ToastContainer />
            </form>
        </div>
    );
};

export default TweetBox;
