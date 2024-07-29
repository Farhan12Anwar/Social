import React, { useState } from 'react';
import { useCreateUserWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import auth  from '../../firebase.init';
import GoogleButton from 'react-google-button';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';

function Signup() {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);
    const [signInWithGoogle, googleUser, googleLoading, googleError] = useSignInWithGoogle(auth);

    if (user || googleUser) {
        const userData = {
            username: username || googleUser?.user?.displayName,
            name: name || googleUser?.user?.displayName,
            email: email || googleUser?.user?.email,
        };

        axios.post('http://localhost:5000/register', userData)
            .then(response => {
                console.log('User registered:', response.data);
                navigate('/');
            })
            .catch(error => {
                console.error('Error registering user:', error);
            });
    }

    if (error || googleError) {
        console.log(error ? error.message : googleError.message);
    }

    if (loading || googleLoading) {
        console.log("LOADING...");
    }

    const handleSubmit = e => {
        e.preventDefault();
        createUserWithEmailAndPassword(email, password);
    };

    const handleGoogleSignIn = () => {
        signInWithGoogle();
    };

    return (
        <div className='login-container'>
            <div className='image-container'></div>
            <div className='form-container'>
                <div className='form-box'>
                    <h2 className='heading'>Don't have an account?</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type='text'
                            className='display-name'
                            placeholder='@username'
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type='text'
                            className='display-name'
                            placeholder='Your Name'
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type='email'
                            className='email'
                            placeholder='Email Address'
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type='password'
                            className='password'
                            placeholder='Password'
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className='btn-login'>
                            <button type='submit' className='btn'>Sign up</button>
                        </div>
                    </form>
                    <hr />
                    <div className='google-button'>
                        <GoogleButton className='g-btn' type='light' onClick={handleGoogleSignIn} />
                    </div>
                    <div>
                        Already have an account?
                        <Link to='/login' style={{ textDecoration: 'none', color: 'skyblue', fontWeight: '600', marginLeft: '5px' }}>
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
