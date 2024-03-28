// import './list.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePageComponent from './Components/HomePage';
import ValidInformation from './Components/Info/Information';
import DashboardComponent from './Components/dashboard/Dashboard';
import AnalyticsComponent from './Components/main/analytics/analytics';
import HomeComponent from './Components/main/home/Home'
import Game from './Components/Game/Game.tsx';
import HeadToHead from './Components/Game/headToHead.tsx';
import Cookies from 'js-cookie';
import chatComponent from './Components/main/chat/chat';
import CallComponent from './Components/call/call';
import SettingsComponent from './Components/main/settings/settings.tsx';
import ProfileComponent from './Components/main/profile/profile.tsx';
import NotFoundComponent from './Components/error/404.component.tsx';
import { useEffect, useState } from 'react';
const url: string = import.meta.env.VITE_API_AUTH_KEY;

function App() {
  localStorage.setItem('theme', 'dark');
  return (
    <>
      {/* <BrowserRouter> */}
      <Routes>
        <Route path="/" element={<HomePageComponent />} />
        <Route path="/dashboard/*" element={<DashboardComponent />}>
          <Route index element={<HomeComponent />} />
          <Route path="analytics" element={<AnalyticsComponent />} />
          <Route path="chat" Component={chatComponent} />
          <Route path="call" element={<CallComponent />} />
          <Route path="profile/*" element={<ProfileComponent />} />
          <Route path="settings" element={<SettingsComponent />} />
          <Route path="game" element={<Game />} />
          <Route path="HeadToHead" element={<HeadToHead />} />
          {/* <Route path="profile" element={<ProfileComponent />} /> */}
          <Route path="*" element={<NotFoundComponent />} />
        </Route>
      </Routes>
    </>
  );
}
export default App;
