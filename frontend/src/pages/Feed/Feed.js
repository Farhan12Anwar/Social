import React, { useEffect, useState } from "react";
import Post from "./Post/Post";
import "./Feed.css";
import TweetBox from "./TweetBox";

function Feed() {
    const [posts, setPosts] = useState([]);
    const [retweetImage, setRetweetImage] = useState('');

    const updatePosts = (newPosts) => {
        setPosts(newPosts);
    };

    const handleRetweet = (imageURL) => {
        // Update retweetImage state with the image URL
        setRetweetImage(imageURL);
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

    useEffect(() => {
        fetch('https://social-3xcd.onrender.com/post')
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
            <TweetBox setPosts={setPosts} updatePosts={updatePosts} retweetImage={retweetImage} setRetweetImage={setRetweetImage} />

            {
                posts.map(p => <Post key={p._id} p={p} onRetweet={handleRetweet} />)
            }
        </div>
    );
}

export default Feed;
