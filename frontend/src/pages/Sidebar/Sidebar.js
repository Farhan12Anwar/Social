import React, { useState } from 'react';
import './Sidebar.css'; // Import the CSS file
import SidebarOptions from "./SidebarOptions";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import MoreIcon from "@mui/icons-material/More";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Divider from '@mui/material/Divider';
import DoneIcon from '@mui/icons-material/Done';
import Button from "@mui/material/Button";
import ListItemIcon from '@mui/material/ListItemIcon';
import { Avatar, IconButton } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CustomLink from './CustomLink';
import useLoggedInUser from '../../hooks/useLoggedInUser';

const Sidebar = ({ handleLogout, user }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);
    const [loggedInUser] = useLoggedInUser();

    const userProfilePic = loggedInUser[0]?.profileImage ? loggedInUser[0]?.profileImage : 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png'

    const handleClick = e => {
        setAnchorEl(e.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const result = user[0].email.split('@')[0];

    return (
        <div className='sidebar'>
            <CustomLink to='/home/feed'>
                <SidebarOptions active Icon={HomeIcon} text='Home' />
            </CustomLink>

            <CustomLink to='/home/messages'>
                <SidebarOptions active Icon={MailOutlineIcon} text='Messages' />
            </CustomLink>

            <CustomLink to='/home/bookmarks'>
                <SidebarOptions active Icon={BookmarkBorderIcon} text='Bookmarks' />
            </CustomLink>

            <CustomLink to='/home/TopPosts'>
                <SidebarOptions active Icon={SearchIcon} text='Top Posts' />
            </CustomLink>

            <CustomLink to='/home/notifications'>
                <SidebarOptions active Icon={NotificationsNoneIcon} text='Notifications' />
            </CustomLink>

            <CustomLink to='/home/poll'>
                <SidebarOptions active Icon={ListAltIcon} text='Poll' />
            </CustomLink>

            <CustomLink to='/home/profile'>
                <SidebarOptions active Icon={PermIdentityIcon} text='Profile' />
            </CustomLink> 

            <CustomLink to='/home/more'>
                <SidebarOptions active Icon={MoreIcon} text='More' />
            </CustomLink> 

            <CustomLink to='/home/feed'>
                <Button variant='outlined' className='sidebar_tweet'>
                    Tweet
                </Button>
            </CustomLink> 

            <div className='Profile_info'>
                <Avatar src={userProfilePic} />
                <div className='user_info'>
                    <h4>
                        {loggedInUser[0]?.name ? loggedInUser[0].name : user && user[0]?.displaName}
                    </h4>
                    <h5>@{result}</h5>
                </div>
                <IconButton
                    size='small'
                    sx={{ ml: 2 }}
                    aria-controls={openMenu ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={ openMenu ? "true" : undefined }
                    onClick={handleClick}
                >
                    <MoreHorizIcon />
                </IconButton>
                <Menu id='basic-menu' anchorEl={anchorEl} open={openMenu} onClose={handleClose}>
                    <MenuItem className='Profile_info'>
                        <Avatar src={userProfilePic} />
                        <div className='user_info'>
                            <div className='user_info subUser_info'>
                                <h4>
                                    {loggedInUser[0]?.name ? loggedInUser[0].name : user && user[0]?.displaName}  
                                </h4>
                                <h5>@{result}</h5>
                            </div>
                            <ListItemIcon className='done_icon'><DoneIcon /></ListItemIcon>
                        </div>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>Add an existing account</MenuItem>
                    <MenuItem onClick={handleLogout}>Log Out</MenuItem>
                </Menu>
            </div>
        </div>
    );
};

export default Sidebar;
