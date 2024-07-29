import React, { useEffect, useState } from "react";
import Post from "./Post/Post";
import "./Feed.css";
import TweetBox from "./TweetBox";

function Feed() {
    const [posts, setPosts] = useState([]);
    const [retweetImage, setRetweetImage] = useState('');
    const [likes, setLikes] = useState([]); // Initialize likes state

    const updatePosts = (newPosts) => {
        setPosts(newPosts);
    };

    const handleRetweet = (imageURL) => {
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
        fetch('http://localhost:5000/post')
            .then(res => res.json())
            .then(data => {
                setPosts(data.reverse());
            });
    }, []);

    return (
        <div className="feed">
            <div className="feed__header">
                <h2>Home</h2>
            </div>
            <TweetBox setPosts={setPosts} updatePosts={updatePosts} retweetImage={retweetImage} setRetweetImage={setRetweetImage} setLikes={setLikes} />
            {
                posts.map(p => (
                    <Post 
                        key={p._id} 
                        p={p} 
                        onRetweet={handleRetweet} 
                        likes={likes} 
                        setLikes={setLikes}
                    />
                ))
            }
        </div>
    );
}

export default Feed;
