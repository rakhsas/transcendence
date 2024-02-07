// import { Engine } from "@tsparticles/engine";
import { Routes, Route, Outlet } from 'react-router-dom';
import NavbarComponent from "../shared/navbar/navbar";
import SidebarComponent from "../shared/sidebar/sidebar";
import "./Dashboard.css"
import HomeComponent from '../main/home/Home';
import ProfileComponent from '../main/profile/profile';
function DashboardComponent(props: any) {
  console.log(props.token)
  return (
    <div className="all flex bg-main-1">
      <SidebarComponent />
      <div className="overflow-hidden flex-1 w-3/4">
        <NavbarComponent />
        
        <div className="h-[100vh] flex-1 flex ">
            <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DashboardComponent;
