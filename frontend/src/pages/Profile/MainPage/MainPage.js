import React, { useState, useEffect } from "react";
import "./MainPage.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CenterFocusWeakIcon from "@mui/icons-material/CenterFocusWeak";
import LockResetIcon from "@mui/icons-material/LockReset";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import AddLinkIcon from "@mui/icons-material/AddLink";
import Post from "../../../pages/Feed/Post/Post";
import { useNavigate } from "react-router-dom";
import EditProfile from "../EditProfile/EditProfile";
import axios from "axios";
import useLoggedInUser from "../../../hooks/useLoggedInUser";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const MainProfile = ({ user }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loggedInUser] = useLoggedInUser();
  const username = user?.email?.split("@")[0];
  const [posts, setPosts] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);

  useEffect(() => {
    fetch(`https://social-3xcd.onrender.com/userPost?email=${user?.email}`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.reverse()); // Reverse the order of posts here
      });
  }, [user?.email]);

  const handleUploadCoverImage = (e) => {
    setIsLoading(true);
    const image = e.target.files[0];
    const formData = new FormData();
    formData.set("image", image);

    axios
      .post(
        "https://api.imgbb.com/1/upload?key=c8aec6badf8fbfa65d704e7ade57dcb0",
        formData
      )
      .then((res) => {
        const url = res.data.data.display_url;
        const userCoverImage = {
          email: user?.email,
          coverImage: url,
        };
        setIsLoading(false);

        if (url) {
          fetch(`https://social-3xcd.onrender.com/userUpdates/${user?.email}`, {
            method: "PATCH",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(userCoverImage),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log("done", data);
            });
        }
      })
      .catch((error) => {
        console.log(error);
        window.alert(error);
        setIsLoading(false);
      });
  };

  const handleDeletePost = (postId) => {
    fetch(`https://social-3xcd.onrender.com/posts/${postId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setPosts(posts.filter((post) => post._id !== postId)); // Update state if deletion is successful
        }
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  };

  const handleUploadProfileImage = (e) => {
    setIsLoading(true);
    const image = e.target.files[0];
    const formData = new FormData();
    formData.set("image", image);

    axios
      .post(
        "https://api.imgbb.com/1/upload?key=c1e87660595242c0175f82bb850d3e15",
        formData
      )
      .then((res) => {
        const url = res.data.data.display_url;
        const userProfileImage = {
          email: user?.email,
          profileImage: url,
        };

        setIsLoading(false);

        if (url) {
          fetch(`https://social-3xcd.onrender.com/userUpdates/${user?.email}`, {
            method: "PATCH",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(userProfileImage.profileImage),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log("done", data);
              console.log(userProfileImage.profileImage);
            });
        }
      })
      .catch((error) => {
        console.log(error);
        window.alert(error);
        setIsLoading(false);
      });
  };

  const toggleDropdown = (postId) => {
    setDropdownVisible(dropdownVisible === postId ? null : postId);
  };

  return (
    <div>
      <ArrowBackIcon className="arrow-icon" onClick={() => navigate("/")} />
      <h4 className="heading-4">{username}</h4>
      <div className="mainprofile">
        <div className="profile-bio">
          <div>
            <div className="coverImageContainer">
              <img
                src={
                  loggedInUser[0]?.coverImage
                    ? loggedInUser[0]?.coverImage
                    : "https://www.proactivechannel.com/Files/BrandImages/Default.jpg"
                }
                alt=""
                className="coverImage"
              />
              <div className="hoverCoverImage">
                <div className="imageIcon_tweetButton">
                  <label htmlFor="image" className="imageIcon">
                    {isLoading ? (
                      <LockResetIcon className="photoIcon photoIconDisabled" />
                    ) : (
                      <CenterFocusWeakIcon className="photoIcon" />
                    )}
                  </label>
                  <input
                    type="file"
                    id="image"
                    className="imageInput"
                    onChange={handleUploadCoverImage}
                  />
                </div>
              </div>
            </div>
            <div className="avatar-img">
              <div className="avatarContainer">
                <img
                  src={
                    loggedInUser[0]?.profileImage
                      ? loggedInUser[0].profileImage
                      : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
                  }
                  className="avatar"
                  alt=""
                />

                <div className="hoverAvatarImage">
                  <div className="imageIcon_tweetButton">
                    <label htmlFor="profileImage" className="imageIcon">
                      {isLoading ? (
                        <LockResetIcon className="photoIcon photoIconDisabled" />
                      ) : (
                        <CenterFocusWeakIcon className="photoIcon" />
                      )}
                    </label>
                    <input
                      type="file"
                      id="profileImage"
                      className="imageInput"
                      onChange={handleUploadProfileImage}
                    />
                  </div>
                </div>
              </div>
              <div className="userInfo">
                <div>
                  <h3 className="heading-3">
                    {loggedInUser[0]?.name
                      ? loggedInUser[0].name
                      : user && user.displayName}
                  </h3>
                  <p className="usernameSection">@{username}</p>
                </div>
                <EditProfile user={user} loggedInUser={loggedInUser} />
              </div>
              <div className="infoContainer">
                {loggedInUser[0]?.bio && <p>{loggedInUser[0].bio}</p>}
                <div className="locationAndLink">
                  {loggedInUser[0]?.location && (
                    <p className="subInfo">
                      <MyLocationIcon /> {loggedInUser[0].location}
                    </p>
                  )}
                  {loggedInUser[0]?.website && (
                    <p className="subInfo link">
                      <AddLinkIcon /> {loggedInUser[0].website}
                    </p>
                  )}
                </div>
              </div>
              <h4 className="tweetsText">Tweets</h4>
              <hr />
            </div>
            {posts.map((p) => (
              <div key={p._id} className="post">
                <div className="postContent">
                  <Post p={p} />
                </div>
                <div className="postOptions">
                  <MoreHorizIcon
                    onClick={() => toggleDropdown(p._id)}
                    className="moreIcon"
                  />
                  {dropdownVisible === p._id && (
                    <div className="dropdownMenu">
                      <button onClick={() => handleDeletePost(p._id)}>
                        Delete Post
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainProfile;
