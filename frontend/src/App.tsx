
// import './list.css';
import { Route, Routes } from 'react-router-dom';
import HomePageComponent from './Components/HomePage';
import DashboardComponent from './Components/dashboard/Dashboard';
import AnalyticsComponent from './Components/main/analytics/analytics';
import HomeComponent from './Components/main/home/Home'
import Game from './Components/Game/Game.tsx';
import HeadToHead from './Components/Game/headToHead.tsx';
import ChatComponent from './Components/main/chat/chat';
import CallComponent from './Components/call/call';
import ProfileComponent from './Components/main/profile/profile.tsx';
import SettingFunction from './Components/main/settings/settings.tsx';
import FunctionProfileForm from './Components/main/profile/profile.tsx';
import WithFriend from './Components/Game/withFriend.tsx';
import { FourHundredFourError } from './Components/main/notfound/error.tsx';
// const url: string = import.meta.env.VITE_API_AUTH_KEY;

function App() {
  if (!localStorage.getItem('theme'))
    localStorage.setItem('theme', 'dark');
  return (
    <>
      {/* <BrowserRouter> */}
      <Routes>
        <Route path="/" element={<HomePageComponent />} />
        <Route path="/dashboard/*" element={<DashboardComponent />}>
          <Route index element={<HomeComponent />} />
          <Route path="analytics" element={<AnalyticsComponent />} />
          <Route path="chat" Component={ChatComponent} />
          <Route path="call" element={<CallComponent />} />
          <Route path="settings" element={<SettingFunction />} />
          <Route path="profile">
            <Route index element={<ProfileComponent />} />
            <Route path=':userId' element={<ProfileComponent />} />
          </Route>
          <Route path="game" element={<Game />} />
          <Route path="gameRoom">
            <Route path=":idFoFriend" element={<WithFriend />} />
          </Route>
          <Route path="HeadToHead" element={<HeadToHead />} />
          <Route path="profile" element={<FunctionProfileForm />} />
          <Route path="*" element={<FourHundredFourError />} />
        </Route>
          <Route path="*" element={<FourHundredFourError />} />

        {/* <Route path="*" element={<Navigate to="/dashboard/*" replace />} /> */}
      </Routes>
    </>
  );
}
export default App;
