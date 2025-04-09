import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { Form } from './components/modules/Form';
import { Dashboard } from './components/modules/Dashboard';
import './App.css';
import { NoPage } from './components/modules/NoPage';
import { Profile } from './components/modules/Profile';
import { DetailPage } from './components/modules/DetailPage';

// ProtectedRoutes component to handle authentication-based routing
const ProtectedRoutes = ({children, auth = false}) => {
  const isLoggedIn = localStorage.getItem('user:token') !== null || false;
  if (!isLoggedIn && auth) {
    return <Navigate to={'/sign-in'} />;
  } 
  else if (isLoggedIn && ['/sign-in', '/sign-up'].includes(window.location.pathname)) {
    return <Navigate to={'/'} />;
  }
  
  return children;
};

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/sign-in'
          element={
            <ProtectedRoutes>
              <Form isSignInPage={true} /> 
            </ProtectedRoutes>
          }
        />
        
        {/* Sign-up page route */}
        <Route
          path='/sign-up'
          element={
            <ProtectedRoutes>
              <Form isSignInPage={false} />
            </ProtectedRoutes>
          }
        />
        
        {/* Home/Dashboard route (requires authentication) */}
        <Route 
          path='/' 
          element={
            <ProtectedRoutes auth={true}> 
              <Dashboard /> 
            </ProtectedRoutes>
          }
        />
        <Route path='/*' element={<NoPage />} /> 
        <Route path='/profile' element={<Profile />} /> 
        <Route path="/task/:taskId" element={<DetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
