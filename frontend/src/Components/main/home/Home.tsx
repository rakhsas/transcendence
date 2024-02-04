// import OwlCarousel from "react-owl-carousel";
// import "owl.carousel/dist/assets/owl.carousel.css";
// import "owl.carousel/dist/assets/owl.theme.default.css";
import classicI from './../../../assets/classicM.svg';
import blackHole from './../../../assets/BlackHole.svg';
import './Home.css'
import GameModesCarousel from './../game/game';
const HomeComponent: React.FC = () => {
    return (
        <>
            <main className="flex-1 px-4">
                <section className="min-h-1/2 border-2 border-fuchsia-700 rounded-3xl">
                    <div className='flex items-center flex-col mt-4 w-full p-2 justify-center'>
                        <p className="uppercase ... text-yellow-200 self-start">Games Mode</p>
                        {/* <div className="h-3/4 bg-gradient-to-t from-slate-950 to-slate-900"> */}
                        <div className='container mx-auto flex-1'>
                            <GameModesCarousel />
                        {/* </div> */}
                        </div>
                    </div>
                </section>
                <section className="bg-green-700 h-2/3">
                    <ul>
                        <li>mode1</li>
                        <li>mode2</li>
                        <li>mode3</li>
                    </ul>
                </section>
            </main>
            <aside className="w-[25%] bg-orange-400 hidden md:block xs:hidden lg:block">
                <div>one</div>
                <div>one</div>
                <div>one</div>
            </aside>
        </>
    )
}
export default HomeComponent;