// import React, { useState } from 'react';
import './list.css';
// import Google from './assets/google.png';
// import Github from './assets/github.jpeg';
// import Intra from './assets/42.jpeg';
// import backgroundImage2 from './assets/intra42.jpej.jpeg';
// import bgm from './assets/Leonardo_Diffusion_XL_images_display_a_man_wears_a_jacket_and_0.jpg';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePageComponent from './Components/HomePage';
import ValidInformation from './Components/Info/Information';
import DashboardComponent from './Components/dashboard/Dashboard';
import AnalyticsComponent from './Components/main/analytics/analytics';
import HomeComponent from './Components/main/home/Home';
import ProfileComponent from './Components/main/profile/profile';
import Cookies from 'js-cookie';

const isAuthenticated = Cookies.get('isAuthenticated');
function App() {
  return (
    <>
      {/* <BrowserRouter> */}
        <Routes>
          <Route path="/" element={<HomePageComponent/>}/>
          <Route
              path="/dashboard/*"
              element={((isAuthenticated) && ( isAuthenticated.length > 0 ) && (isAuthenticated === 'true')) ? (<DashboardComponent />) : (<Navigate to="/" replace />)}
            >
              <Route index element={<HomeComponent />} />
              <Route path="profile" element={<ProfileComponent />} />
              <Route path="analytics" element={<AnalyticsComponent />} />
            </Route>
          {/* <Route path="/SignIn" element={<FunctionSignUpForm/>} /> */}
          <Route path="/login"  element={<ValidInformation/>}/>
        </Routes>
    {/* </BrowserRouter> */}
    </>
  )
}
export  default App;