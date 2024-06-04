import React from 'react'
import '../pages.css'
import MainPage from './MainPage/MainPage';
import { useAuthState } from "react-firebase-hooks/auth";
import auth from '../../firebase.init';

function Profile() {
    const [user] = useAuthState(auth);

    return (
        <div className='profilePage'>
            <MainPage user={user} />
        </div>
    )
}

export default Profile;