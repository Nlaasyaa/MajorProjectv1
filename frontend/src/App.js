import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import Home from './components/Home';
import History from './components/History';
import { getMe } from './services/authService';

function App(){
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Logic to check for existing token and fetch user details
  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(token){
      // Tries to authenticate the user token via the backend
      getMe(token).then(res => setUser(res.user)).catch(()=> localStorage.clear());
    }
  }, []); // Note: useEffect runs once on mount.

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <div>
      <NavBar user={user} onLogout={handleLogout} />
      
      {/* This main div wraps the content below the NavBar. 
        We use Tailwind padding (p-4) instead of a fixed 'container' class 
        because Login/Signup will handle their own full-page centering 
        and Home/History will use a max-width wrapper inside their components.
      */}
      <div className="p-4 lg:p-8">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/signup" element={<SignupForm onLogin={(u) => setUser(u)} />} />
          {/* Note: LoginForm renders the full-screen layout */}
          <Route path="/login" element={<LoginForm onLogin={(u)=> setUser(u)} />} /> 
          <Route path="/history" element={<History user={user} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;