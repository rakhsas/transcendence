// import { Engine } from "@tsparticles/engine";
import NavbarComponent from "../shared/navbar/navbar";
import SidebarComponent from "../shared/sidebar/sidebar";
import "./Dashboard.css"
// import Particle from "../shared/particles/particleBg";
function DashboardComponent(): JSX.Element {

  return (
    <div className=" all flex">
      <SidebarComponent />
      <div className="container overflow-hidden">
        <NavbarComponent />
        
        <div className=" bg-white h-[100vh] flex-1 flex">

          {/* main components */}
          <main className="flex-1">
            <section className="bg-red-700 h-1/3">
              <ul>
                <li>mode1</li>
                <li>mode2</li>
                <li>mode3</li>
              </ul>
            </section>
            <section className="bg-green-700 h-2/3">
              <ul>
                <li>mode1</li>
                <li>mode2</li>
                <li>mode3</li>
              </ul>
            </section>
          </main>
          {/* aside components */}
        </div>
      </div>
      <aside className="w-[35%] bg-orange-400 hidden md:block lg:block">
        <div>one</div>
        <div>one</div>
        <div>one</div>
      </aside>
    </div>
  )
}

export default DashboardComponent;