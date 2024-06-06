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

const TweetBox = ({ setPosts, updatePosts }) => {
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
        e.preventDefault();
        
        // Check if tweet is empty and no image is uploaded
        if (!post.trim() && !imageURL) {
            toast.error("The tweet cannot be empty!");
            return;
        }

        if (user.providerData[0].providerId === 'password') {
            fetch(`http://localhost:5000/loggodInUser?email=${email}`)
                .then(res => res.json())
                .then(data => {
                    setName(data[0]?.name);
                    setUsername(data[0]?.username);
                })
        } else {
            setName(user?.displayName);
            setUsername(email?.split('@')[0]);
        }

        if (name) {
            const userPost = {
                profilePhoto: userProfilePic,
                username: username,
                name: name,
                email: email,
                post: post,
                photo: imageURL
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
                setIsLoading(false);
            })
        }
    };

    return (
        <div className="tweetBox">
            <form onSubmit={handleTweet}>
                <div className="tweetBox_input">
                    <Avatar src={userProfilePic} />
                    <input
                        type="text"
                        placeholder="What's happening?"
                        value={post}
                        onChange={(e) => setPost(e.target.value)}
                    />
                </div>
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
