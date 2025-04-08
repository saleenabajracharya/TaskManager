import { useState } from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { Form } from './components/modules/Form';
import { Dashboard } from './components/modules/Dashboard';
import './App.css';
import { NoPage } from './components/modules/NoPage';
import { Profile } from './components/modules/Profile';
import { DetailPage } from './components/modules/DetailPage';

const ProtectedRoutes = ({children, auth = false}) => {
  const isLoggedIn = localStorage.getItem('user:token') !== null || false;
  if (!isLoggedIn && auth) {
    return <Navigate to={'/sign-in'} />;
  } else if (isLoggedIn && ['/sign-in', '/sign-up'].includes(window.location.pathname)) {
    return <Navigate to={'/'} />;
  }
  return children;
};

function App() {
  const [count, setCount] = useState(0);

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
        <Route
          path='/sign-up'
          element={
            <ProtectedRoutes>
              <Form isSignInPage={false} />
            </ProtectedRoutes>
          }
        />
        <Route
          path='/'
          element={
            
              <Dashboard />
           
          }
        />
        <Route path='/*' element={<NoPage/>} />
        <Route path='/profile' element={<Profile/>} />
        <Route path="/task/:taskId" element={<DetailPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
