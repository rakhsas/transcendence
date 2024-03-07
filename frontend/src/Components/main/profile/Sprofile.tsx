// import DataContext from '../../../services/data.context';

import { useContext, useEffect, useState } from "react";
import './Friends.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
// import { Doughnut } from 'react-chartjs-2';
import CreatChartDesign from './Chart'
import DataContext from "../../../services/data.context";
import './Sprofile.css';
import "./list.css";
import './profile.css'
import User from "../../../model/user.model";
import AuthService from "../../../services/auth.service";
import UserService from "../../../services/user.service";
import LoadingComponent from "../../shared/loading/loading";
import Achei from '../../../assets/acheivements/poker.png'
import Achei2 from '../../../assets/acheivements/fire.png'
import Achei3 from '../../../assets/acheivements/fire3.png'
import Achei4 from '../../../assets/acheivements/fire2.png'
import Achei5 from '../../../assets/acheivements/8pool1.png'
// import LoadingComponent from "../../shared/loading/loading";

function ProfileComponent(): JSX.Element {
    const userData = useContext(DataContext);// get the value of user
    if (!userData)
        return <LoadingComponent />;
    console.log("userData: ", userData);
    // const [userData, setUserData] = useState<User | null>(null);
    // useEffect(() => {
    // 	const fetchData = async () => {
    // 		try {
    // 			const authService = new AuthService();
    // 			const fetchedPayloadData = await authService.getPayload();
    // 			const userService = new UserService();
    // 			const fetchedUserData = await userService.getUser(fetchedPayloadData.id);
    // 			setUserData(fetchedUserData);
    // 		} catch (error) {
    // 			console.error('Error fetching user ', error);
    // 		}
    // 	};
    // 	fetchData();
    // }, []);
    return (
        // <div className='Sc2 overflow-scroll no-scrollbar flex flex-row w-fill h-fill justify-between gap-2 bg-red-300'>
        <div className="body m-4 flex flex-col new:flex-row w-full h-[90vh] justify-between gap-4 bg-inherit overflow-hidden overflow-y-scroll no-scrollbar">
            <div className="part1 flex flex-col  md:flex-row gap-4 w-full md:min-w-[50%] min-h-full overflow-hidden">

                <div className="bg-gray-600  h-full w-full bg-color  overflow-y-scroll no-scrollbar">
                    <h1 className='overflow-y-scroll no-scrollbar text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 sheap1'>
                        USER-PROFIL
                    </h1>
                    <div className="form-content overflow-scroll no-scrollbar">

                        {/* <div className='' style={{ backgroundColor: `${userData.coalitionCover || ''}` }} >
                            <img src={userData.coalitionPic || ''} alt="" className='im-list2' style={{ backgroundColor: `${userData.coalitionColor || ''}` }} />
                        </div> */}
                        <img src={userData?.picture} alt="" className="log2Sing"  style={{border: `3px solid ${userData.coalitionColor}`}}/>
                        <form action="#">
                            <div className="mt-8">
                                <div>
                                    <div className="grid gap-0 mt-12 lg:grid-cols-0 list">
                                        <div>

                                            <div id="last_name" className="bg-gray-50 mt-8 border mb-4 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block 
                                                w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 par"   >
                                                <p className="NT2">{(userData?.firstName || 'Mohamed')}</p>
                                            </div>
                                        </div>
                                        <div>

                                            <div id="last_name" className="bg-gray-50 mt-8 border mb-4 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block 
                                                w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 par"   >
                                                <p className="NT2">{(userData?.lastName || 'Darify')}</p>

                                            </div>
                                        </div>
                                        <div>

                                            <p id="last_name" className="bg-gray-50 mt-8 border mb-4 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block 
                                                w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 par"   >
                                                {(userData?.username || 'mdarify')}</p>
                                        </div>
                                        <div>

                                            <p id="last_name" className="bg-gray-50 mt-8 border mb-4 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block 
                                                w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 par"   >
                                                {(userData?.email || 'mdarify@student.1337.ma')}</p>
                                        </div>
                                    </div>


                                    <button type="submit" className="text-white  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 
                                            text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 par mt-12"
                                        style={{ backgroundColor: `${userData?.coalitionColor || 'https://profile.intra.42.fr/users/mdarify'}` }}>
                                        <a style={{ textDecoration: 'none' }} href="https://profile.intra.42.fr/users/mdarify">Profile Intra</a>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                </div>
                <div className="bg-green-300 h-full w-full bg-color verflow-hidden overflow-y-scroll no-scrollbar">
                    <div className="form-content overflow-scroll no-scrollbar">
                        <h1 className='overflow-y-scroll no-scrollbar text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 sheap1'>
                            SCORE-MATCHES
                        </h1>
                        <div className='op'>
                            <div className='op-child p-4 mt-4 '>
                                <img src={userData?.picture || 'https://cdn.intra.42.fr/users/8e71bcf73bbcaa85758398fc53fd6fcc/mdarify.JPG'} style={{border: `3px solid ${userData.coalitionColor}`}}alt="" className='coal1' />
                                <div className='child-ch1 overflow-y-scroll no-scrollbar'>
                                    <p className='ch1-p'>1</p>
                                    <p className='ch2-p'>2</p>
                                </div>
                                <img src={userData?.picture || 'https://cdn.intra.42.fr/users/8e71bcf73bbcaa85758398fc53fd6fcc/mdarify.JPG'} style={{border: `3px solid ${userData.coalitionColor}`}}alt="" className='coal2' />
                            </div>
                            <div className='op-child p-4 mt-4'>
                                <img src={userData?.picture || 'https://cdn.intra.42.fr/users/8e71bcf73bbcaa85758398fc53fd6fcc/mdarify.JPG'} style={{border: `3px solid ${userData.coalitionColor}`}}alt="" className='coal1' />
                                <div className='child-ch1 overflow-y-scroll no-scrollbar'>
                                    <p className='ch1-p'>5</p>
                                    <p className='ch2-p'>3</p>
                                </div>
                                <img src={userData?.picture || 'https://cdn.intra.42.fr/users/8e71bcf73bbcaa85758398fc53fd6fcc/mdarify.JPG'} style={{border: `3px solid ${userData.coalitionColor}`}} alt="" className='coal2' />
                            </div>
                            <div className='op-child p-4 mt-4'>
                                <img src={userData?.picture || 'https://cdn.intra.42.fr/users/8e71bcf73bbcaa85758398fc53fd6fcc/mdarify.JPG'} style={{border: `3px solid ${userData.coalitionColor}`}} alt="" className='coal1' />
                                <div className='child-ch1 overflow-y-scroll no-scrollbar'>
                                    <p className='ch1-p'>4</p>
                                    <p className='ch2-p'>5</p>
                                </div>
                                <img src={userData?.picture || 'https://cdn.intra.42.fr/users/8e71bcf73bbcaa85758398fc53fd6fcc/mdarify.JPG'}style={{border: `3px solid ${userData.coalitionColor}`}} alt="" className='coal2' />
                            </div>
                            <div className='op-child p-4 mt-4'>
                                <img src={userData?.picture || 'https://cdn.intra.42.fr/users/8e71bcf73bbcaa85758398fc53fd6fcc/mdarify.JPG'}style={{border: `3px solid ${userData.coalitionColor}`}} alt="" className='coal1' />
                                <div className='child-ch1 overflow-y-scroll no-scrollbar'>
                                    <p className='ch1-p'>0</p>
                                    <p className='ch2-p'>5</p>
                                </div>
                                <img src={userData?.picture || 'https://cdn.intra.42.fr/users/8e71bcf73bbcaa85758398fc53fd6fcc/mdarify.JPG'}style={{border: `3px solid ${userData.coalitionColor}`}} alt="" className='coal2' />
                            </div>
                            <div className='op-child p-4 mt-4'>
                                <img src={userData?.picture || 'https://cdn.intra.42.fr/users/8e71bcf73bbcaa85758398fc53fd6fcc/mdarify.JPG'}style={{border: `3px solid ${userData.coalitionColor}`}} alt="" className='coal1' />
                                <div className='child-ch1 overflow-y-scroll no-scrollbar'>
                                    <p className='ch1-p'>3</p>
                                    <p className='ch2-p'>5</p>
                                </div>
                                <img src={userData?.picture || 'https://cdn.intra.42.fr/users/8e71bcf73bbcaa85758398fc53fd6fcc/mdarify.JPG'}style={{border: `3px solid ${userData.coalitionColor}`}} alt="" className='coal2' />
                            </div>
                            <div className='op-child p-4 mt-4'>
                                <img src={userData?.picture || 'https://cdn.intra.42.fr/users/8e71bcf73bbcaa85758398fc53fd6fcc/mdarify.JPG'}style={{border: `3px solid ${userData.coalitionColor}`}} alt="" className='coal1' />
                                <div className='child-ch1 overflow-y-scroll no-scrollbar'>
                                    <p className='ch1-p'>2</p>
                                    <p className='ch2-p'>5</p>
                                </div>
                                <img src={userData?.picture || 'https://cdn.intra.42.fr/users/8e71bcf73bbcaa85758398fc53fd6fcc/mdarify.JPG'}style={{border: `3px solid ${userData.coalitionColor}`}} alt="" className='coal2' />
                            </div>
                            <div className='op-child p-4 mt-4'>
                                <img src={userData?.picture || 'https://cdn.intra.42.fr/users/8e71bcf73bbcaa85758398fc53fd6fcc/mdarify.JPG'} style={{border: `3px solid ${userData.coalitionColor}`}}alt="" className='coal1' />
                                <div className='child-ch1 overflow-y-scroll no-scrollbar'>
                                    <p className='ch1-p'>5</p>
                                    <p className='ch2-p'>1</p>
                                </div>
                                <img src={userData?.picture || 'https://cdn.intra.42.fr/users/8e71bcf73bbcaa85758398fc53fd6fcc/mdarify.JPG'}style={{border: `3px solid ${userData.coalitionColor}`}} alt="" className='coal2' />
                            </div>
                            <div className='op-child p-4 mt-4'>
                                <img src={userData?.picture || 'https://cdn.intra.42.fr/users/8e71bcf73bbcaa85758398fc53fd6fcc/mdarify.JPG'} style={{border: `3px solid ${userData.coalitionColor}`}}alt="" className='coal1' />
                                <div className='child-ch1 overflow-y-scroll no-scrollbar'>
                                    <p className='ch1-p'>4</p>
                                    <p className='ch2-p'>5</p>
                                </div>
                                <img src={userData?.picture || 'https://cdn.intra.42.fr/users/8e71bcf73bbcaa85758398fc53fd6fcc/mdarify.JPG'}style={{border: `3px solid ${userData.coalitionColor}`}} alt="" className='coal2' />
                            </div>
                            <div className='op-child p-4 mt-4'>
                                <img src={userData?.picture || 'https://cdn.intra.42.fr/users/8e71bcf73bbcaa85758398fc53fd6fcc/mdarify.JPG'} style={{border: `3px solid ${userData.coalitionColor}`}}alt="" className='coal1' />
                                <div className='child-ch1 overflow-y-scroll no-scrollbar'>
                                    <p className='ch1-p'>5</p>
                                    <p className='ch2-p'>4</p>
                                </div>
                                <img src={userData?.picture || 'https://cdn.intra.42.fr/users/8e71bcf73bbcaa85758398fc53fd6fcc/mdarify.JPG'} style={{border: `3px solid ${userData.coalitionColor}`}}alt="" className='coal2' />
                            </div>
                            <div className='op-child p-4 mt-4'>
                                <img src={userData?.picture || 'https://cdn.intra.42.fr/users/8e71bcf73bbcaa85758398fc53fd6fcc/mdarify.JPG'} style={{border: `3px solid ${userData.coalitionColor}`}}alt="" className='coal1' />
                                <div className='child-ch1 overflow-y-scroll no-scrollbar'>
                                    <p className='ch1-p'>5</p>
                                    <p className='ch2-p'>3</p>
                                </div>
                                <img src={userData?.picture || 'https://cdn.intra.42.fr/users/8e71bcf73bbcaa85758398fc53fd6fcc/mdarify.JPG'}style={{border: `3px solid ${userData.coalitionColor}`}} alt="" className='coal2' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="part2 flex flex-col md:flex-row gap-4 w-full md:min-w-[50%] min-h-full ">
                <div className="bg-red-300 h-full w-full bg-color overflow-hidden overflow-y-scroll no-scrollbar">
                    <div className="form-content overflow-scroll no-scrollbar">
                        <h1 className='overflow-y-scroll no-scrollbar text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 sheap1'>
                            ACHIEVEMENTS
                        </h1>
                        <div className='op overflow-y-scroll no-scrollbar' >
                            <div className='op-child he-child p-4 mt-4'>
                                <img src={Achei}  className='verify' style={{ color: `${userData?.coalitionColor || ''}` }}  alt="" />
                                <p className='Achevdecor overflow-y-scroll no-scrollbar overflow-hidden'>Play The First Game</p>
                            </div>
                            <div className='op-child he-child p-4 mt-4'>
                                <img src={Achei3}  className='verify' style={{ color: `${userData?.coalitionColor || ''}` }}  alt="" />
                                <p className='Achevdecor overflow-y-scroll no-scrollbar'>You win The First Game</p>
                            </div>
                            <div className='op-child he-child p-4 mt-4'>
                                <img src={Achei4}  className='verify' style={{ color: `${userData?.coalitionColor || ''}` }}  alt="" />
                                <p className='Achevdecor overflow-y-scroll no-scrollbar'>You win The Maximum Score</p>
                            </div>
                            <div className='op-child he-child p-4 mt-4'>
                                <img src={Achei5}  className='verify' style={{ color: `${userData?.coalitionColor || ''}` }}  alt="" />
                                <p className='Achevdecor overflow-y-scroll no-scrollbar'>You win The First 5 Games</p>
                            </div>
                            <div className='op-child he-child p-4 mt-4'>
                                <img src={Achei}  className='verify' style={{ color: `${userData?.coalitionColor || ''}` }}  alt="" />
                                <p className='Achevdecor overflow-y-scroll no-scrollbar'>You Play vs Your Friend</p>
                            </div>
                            <div className='op-child he-child p-4 mt-4'>
                                <img src={Achei}  className='verify' style={{ color: `${userData?.coalitionColor || ''}` }}  alt="" />
                                <p className='Achevdecor overflow-y-scroll no-scrollbar'>You Acheived The level 1</p>
                            </div>
                            <div className='op-child he-child p-4 mt-4'>
                                <img src={Achei}  className='verify' style={{ color: `${userData?.coalitionColor || ''}` }}  alt="" />
                                <p className='Achevdecor overflow-y-scroll no-scrollbar'>You Acheived The level 10</p>
                            </div>
                            <div className='op-child he-child p-4 mt-4'>
                                <img src={Achei}  className='verify' style={{ color: `${userData?.coalitionColor || ''}` }}  alt="" />
                                <p className='Achevdecor overflow-y-scroll no-scrollbar'>You Acheived The level 100</p>
                            </div>
                            <div className='op-child he-child p-4 mt-4'>
                                <img src={Achei}  className='verify' style={{ color: `${userData?.coalitionColor || ''}` }}  alt="" />
                                <p className='Achevdecor overflow-y-scroll no-scrollbar'>You win The First 10 Games</p>
                            </div>
                            <div className='op-child he-child p-4 mt-4'>
                                <img src={Achei2}  className='verify' style={{ color: `${userData?.coalitionColor || ''}` }}  alt="" />
                                <p className='Achevdecor overflow-y-scroll no-scrollbar'>You win The First 100 Games</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-rose-900 h-full w-full bg-color overflow-hidden overflow-y-scroll no-scrollbar">
                    <div className="form-content overflow-scroll no-scrollbar">
                        <h1 className='overflow-y-scroll no-scrollbar text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 sheap1'>
                            PROGRESS
                        </h1>
                        <div className='op overflow-y-scroll no-scrollbar'>
                            <CreatChartDesign></CreatChartDesign>
                            <CreatChartDesign></CreatChartDesign>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}


export default ProfileComponent;