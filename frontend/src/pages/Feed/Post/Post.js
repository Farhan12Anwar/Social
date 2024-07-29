import React from "react";
import "./Post.css";
import { Avatar } from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PublishIcon from "@mui/icons-material/Publish";

function Post({ p, onRetweet, likes, setLikes }) {
  const { _id, name, email, username, photo, post, profilePhoto } = p;

  const handlePostClick = () => {
    console.log("Post.js line-15");
  };

  async function downloadImage(imageSrc, nameOfDownload = 'my-image.png') {
    const response = await fetch(imageSrc);
    const blobImage = await response.blob();
    const href = URL.createObjectURL(blobImage);
    const anchorElement = document.createElement('a');
    anchorElement.href = href;
    anchorElement.download = nameOfDownload;
    document.body.appendChild(anchorElement);
    anchorElement.click();
    document.body.removeChild(anchorElement);
  }

  const handleRetweet = () => {
    onRetweet(photo);
  };

  const handleLike = () => {
    setLikes(prevLikes => {
      const newLikes = [...prevLikes];
      if (newLikes.includes(_id)) {
        return newLikes.filter(likeId => likeId !== _id);
      } else {
        return [...newLikes, _id];
      }
    });
  };

  return (
    <div className="post" onClick={handlePostClick}>
      <div className="post_avatar">
        <Avatar src={profilePhoto} />
      </div>
      <div className="post_body">
        <div className="post_header">
          <div className="post_headerText">
            <h3>{name}{" "}
              <span className="post_headerSpecial">
                @{username}
              </span>
            </h3>
          </div>
          <div className="post_headerDescription">
            <p>{post}</p>
          </div>
        </div>
        <img src={photo} alt="" width="500" onClick={() => downloadImage(photo)} />
        <div className="post_footer">
          <div className="post_footer_icon_container">
            <ChatBubbleOutlineIcon className="post_footer_icon" fontSize="small" />
            <span className="icon_placeholder">Comment</span>
          </div>
          <div className="post_footer_icon_container">
            <RepeatIcon className="post_footer_icon" fontSize="small" onClick={handleRetweet} />
            <span className="icon_placeholder">Retweet</span>
          </div>
          <div className="post_footer_icon_container">
            <FavoriteBorderIcon 
              className={`post_footer_icon ${likes.includes(_id) ? 'liked' : ''}`} 
              fontSize="small" 
              onClick={handleLike} 
            />
            <span className="icon_placeholder">Like</span>
          </div>
          <div className="post_footer_icon_container">
            <PublishIcon className="post_footer_icon" fontSize="small" />
            <span className="icon_placeholder">Share</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
