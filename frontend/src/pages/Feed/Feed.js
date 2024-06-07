import React, { useEffect, useState } from "react";
import Post from "./Post/Post";
import "./Feed.css";
import TweetBox from "./TweetBox";
import $ from 'jquery';

function Feed() {
    const [posts, setPosts] = useState([]);
    const [retweetedPost, setRetweetedPost] = useState(null);

    const clearTweetBox = () => {
        setRetweetedPost(null);
    };

    const updatePosts = (newPosts) => {
        setPosts(newPosts);
    };

    useEffect(() => {
        fetch('http://localhost:5000/post')
            .then(res => res.json())
            .then(data => {
                setPosts(data.reverse());
            });
    }, []);

    const handleRetweet = (tweet) => {
        setRetweetedPost(tweet);
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
       scrollToTop();
    };

    const scrollToTop = () => {
        const scrollToTopButton = document.getElementById("top");
        scrollToTopButton.scrollIntoView({ behavior: "smooth" });
      };

    return (
        <div className="feed" >
            <div id="top"></div>
            <div className="feed__header">
                <h2>Home</h2>
            </div>
            <TweetBox 
                setPosts={setPosts} 
                clearTweetBox={clearTweetBox} 
                updatePosts={updatePosts} 
                retweetedPost={retweetedPost} 
            />
            {posts.map(p => (
                <Post key={p._id} p={p} handleRetweet={handleRetweet} />
            ))}
        </div>
    );
}

export default Feed;
