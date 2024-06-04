import React, { useEffect, useState } from "react";
import Post from "./Post/Post";
import "./Feed.css";
import TweetBox from "./TweetBox";

function Feed() {
    const [posts, setPosts] = useState([]);
    const [post, setPost] = useState(''); // Define setPost state
    const [imageURL, setImageURL] = useState(''); // Define setImageURL state
    const [isLoading, setIsLoading] = useState('');
    const clearTweetBox = () => {
    setPost('');
    setImageURL('');
    setIsLoading('');
    };
    
    const updatePosts = (newPosts) => {
    setPosts(newPosts);
};

    useEffect(() => {
    fetch('http://localhost:5000/post')
        .then(res => res.json())
        .then(data => {
            setPosts(data.reverse());
        })
}, [posts]);

    return (
        <div className="feed">
            <div className="feed__header">
                <h2>Home</h2>
            </div>
            <TweetBox setPosts={setPosts} clearTweetBox={clearTweetBox} updatePosts={updatePosts} />
            {
                posts.map(p => <Post key={p._id} p={p} />)
            }
        </div>

    )

}

export default Feed