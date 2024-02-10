import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
import './index.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {FunctionSignUpForm, App}  from './App.tsx';
import HomePageComponent from './Components/HomePage.tsx';
import HomeComponent from './Components/main/home/Home.tsx'; './Components/main/home/Home.tsx';
import DashboardComponent from './Components/dashboard/Dashboard.tsx';
import ValidInformation from './Components/Info/Information.tsx';
import React from 'react';
import ProfileComponent from './Components/main/profile/profile.tsx';
import GameComponent from './Components/main/game/game.tsx';
import AnalyticsComponent from './Components/main/analytics/analytics.tsx';



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
