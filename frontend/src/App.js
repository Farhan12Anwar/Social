import './App.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Login/Signup';
import ProtectedRoute from './pages/ProtectedRoute';
import Feed from './pages/Feed/Feed.js'
import Explore from './pages/Explore/Explore.js';
import Notifications from './pages/Notifications/Notifications.js';
import Messages from './pages/Messages/Messages.js';
import Bookmarks from './pages/Bookmarks/Bookmarks.js';
import Lists from './pages/Lists/Lists.js';
import Profile from './pages/Profile/Profile.js';
import More from './pages/More/More.js';

function App() {
  return (
    <div className="App">
         <BrowserRouter>
        <Routes>
          <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>} >
            <Route index element={<Feed />} />
          </Route>
          <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>}>
            <Route path='feed' element={<Feed />} />
            <Route path='explore' element={<Explore />} />
            <Route path='notifications' element={<Notifications />} />
            <Route path='messages' element={<Messages />} />
            <Route path='bookmarks' element={<Bookmarks />} />
            <Route path='lists' element={<Lists />} />
            <Route path='profile' element={<Profile />} />
            <Route path='more' element={<More />} />
            
          </Route>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          {/* <Route path='/page-loading' element={<PageLoading />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
