import './Home.css'
import avatar from './../../../assets/img/Frame.svg'
import coin from './../../../assets/img/icons8-coin-48.png'
import GameModesCarousel from './../game/game';
import User from './../../../model/user.model'
import { useLocation } from 'react-router-dom';

const HomeComponent: React.FC = (props) => {
    const location = useLocation();
    const userData = location.state as User;
    console.log(userData)
    return (
        <>
            <main className="flex-1 p-4 overflow-y-auto">
                <section className="min-h-1/2 border-2 border-fuchsia-700 rounded-3xl">
                    <div className='flex items-center flex-col mt-4 w-full p-2 justify-center'>
                        <p className="uppercase ... text-yellow-200 self-start">Games Mode</p>
                        <div className='container mx-auto flex-1'>
                            <GameModesCarousel />``
                        </div>
                    </div>
                </section>
                <section className="bg-green-700 h-2/3 mt-4">
                    <ul>
                        <li>mode2</li>
                        <li>mode3</li>
                    </ul>
                </section>
            </main>
            <aside className="bg-main-1  p-8 border-2 rounded-lg">
            {/* bg-[url('/img/hero-pattern.svg')] */}
                <div className="profile h-72 rounded-2xl border-white border-2 bg-cover" style={{backgroundImage: `url(${userData.coalitionCover})`}}>
                    <div className="header flex justify-center h-[15%] text-white items-center bg-red-500 rounded-t-2xl">
                        <h3>My Profile</h3>
                    </div>
                    <div className="body flex flex-col p-4">
                        <div className="data flex flex-row gap-4">
                            <div className="pic rounded-3xl w-20 h-20" style={{backgroundImage: `url(${userData.picture})`, backgroundPosition: `center`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}>
                            </div>
                            <div className="info mt-1">
                                <span className="text-yellow-100"> {userData ? userData.username : 'Loading...'}</span>
                                <div className="row flex items-center">
                                    <img src={coin} height={16} width={16} alt="" />
                                    <span className="text-red-400 text-sm"> Level 0</span>
                                </div>
                            </div>
                            <div className="divider border-s-2 border-gray-600 h-12"></div>
                            <div className="achievement">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="banner" x="0px" y="0px" width="70" height="70" viewBox="0 0 68 104" fill={userData ? userData.coalitionColor : '#000'} xmlSpace="preserve" className="coalition-flag--flag">
                                    <g id="banner-content">
                                        <g id="UI-Intranet-banner-content" transform="translate(-96.000000, -60.000000)">
                                            <g id="banner-content-g-1" transform="translate(96.000000, 60.000000)">
                                                <polygon id="banner-content-polygon-1" points="0,0 0,80.5 34.3,104 68,80.5 68,0"></polygon>
                                            </g>
                                        </g>
                                    </g>
                                    <foreignObject x="0" y="0" width="68" height="50">
                                        <img src={userData ? userData.coalitionPic : avatar} alt="" />
                                    </foreignObject>
                                </svg>
                            </div>
                        </div>
                        <div className="info">
                            <h1>fsfafdsfsjkdhfjksdhkfhdskkfsdksd</h1>
                        </div>
                    </div>
                </div>
                <div className="activity"></div>
            </aside>
        </>
    )
}
export default HomeComponent;