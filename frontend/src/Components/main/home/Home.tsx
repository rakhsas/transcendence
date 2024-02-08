// import OwlCarousel from "react-owl-carousel";
// import "owl.carousel/dist/assets/owl.carousel.css";
// import "owl.carousel/dist/assets/owl.theme.default.css";
import './Home.css'
import avatar from './../../../assets/img/Frame.svg'
import coin from './../../../assets/img/icons8-coin-48.png'
import GameModesCarousel from './../game/game';
import User from './../../../model/user.model'
import UserService from '../../../services/user.service';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

const HomeComponent: React.FC = (props) => {
    // const [token, setToken ] = useState('');
    var data;
    useEffect(() => {
        const userService = new UserService;
        const fetchData = async () => {
            try {
                const res = await userService.getUser(95248);
                console.log("data: ", res.data);
                // Update state or do further processing here
            } catch (error) {
                // console.error('Error fetching user:', error);
                // Handle error gracefully
            }
        };
        
        fetchData();
    }, []);
    // const token = Cookies.get('access_token');
    // if (token)
    // {
    //     data = userService.getUser(token, 95248 );
    //     console.log(data);
    // }
    // console.log(token);
    return (
        <>
            <main className="flex-1 px-4 overflow-hidden">
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
            <aside className="w-[25%] bg-main-1 hidden md:block xs:hidden lg:block p-8 border-2 rounded-lg">
                <div className="profile bg-transparent h-72 rounded-2xl border-white border-2">
                    <div className="header flex justify-center h-[15%] text-white items-center bg-red-500 rounded-t-2xl">
                        <h3>My Profile</h3>
                    </div>
                    <div className="body flex justify-start items-start flex-row p-4">
                        <div className="data flex flex-row gap-2">
                            <div className="pic rounded-sm">
                                <img src={avatar} height={60} width={60} alt=""/>
                            </div>
                            <div className="info mt-1">
                                <span className="text-yellow-100"> Rakhsas </span>
                                <div className="row flex flex-row">
                                    <img src={coin} height={12} width={14} alt=""/>
                                    <span className="text-red-400 text-sm"> Level 0</span>
                                </div>
                            </div>
                            <div className="divider border-s-2 border-gray-600 h-fill"></div>
                            <div className="achievement">
                                <img src={avatar} height={60} width={60} alt=""/>
                            </div>
                        </div>
                        <div className="info"></div>
                    </div>
                </div>
                <div className="activity"></div>
            </aside>
        </>
    )
}
export default HomeComponent;