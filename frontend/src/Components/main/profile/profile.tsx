
import { useContext, useEffect, useState } from 'react';
// import DataContext from '../../../services/data.context';

import DataContext from '../../../services/data.context';
import Achei from '../../../assets/acheivements/poker.png'
import Achei2 from '../../../assets/acheivements/fire.png'
import Achei3 from '../../../assets/acheivements/fire3.png'
import Achei4 from '../../../assets/acheivements/fire2.png'
import Achei5 from '../../../assets/acheivements/8pool1.png'
import Achei6 from '../../../assets/acheivements/fire1.png'
import Achei1 from '../../../assets/acheivements/poker1.png'
import './updateprofile.css'
import CreatChartDesign from './Chart';
import picture from './mdarify.png'
import { useNavigate } from 'react-router-dom';
import LoadingComponent from '../../shared/loading/loading';
import User from '../../../model/user.model';
import UserService from '../../../services/user.service';

interface ButtonAttributes {
    className: string;
    value: string;
    onClick?: () => void;
}

function FunctionAddFriend() {
    const handleButtonClick = () => {
        // Update the attributes object when the button is clicked
        setAttributes({
            ...attributes,
            value: 'Friend',
            onClick: undefined, // Assuming you want to remove the onClick handler after clicking
        });
    };

    const [attributes, setAttributes] = useState<ButtonAttributes>({
        className: 'inline-flex items-center px-4 py-2 text-sm h-auto overflow-hidden text-center text-black-950 font-bold bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800',
        value: 'Add Friend',
        onClick: handleButtonClick, // assuming handleButtonClick function is defined elsewhere
    });

    return (
        <button {...attributes}>
            {attributes.value}
        </button>
    );
}

function FunctionProfileForm() {
    const [id, setId] = useState<string>('');
    const userData = useContext(DataContext);
    const navigate = useNavigate();
    const [user, setUser] = useState<User>();
    useEffect(() => {
        if (!userData) {
            return;
        }
        let routepath = window.location.pathname;
        setId(routepath.split('/').findLast((item: any) => item) || '');
        setUser(userData[0]);
    }, [userData]);

    useEffect(() => {
        console.log(id);
        if (id !== 'profile') {
            const userService = new UserService();
            const test = async () => {
                const user = await userService.getUser(id);
                setUser(user);
            }
            // test();
        }
    }, [id, navigate]);
    const [BlockedFriend, SetBlocked] = useState<boolean>(false);
    const ButtonClick = () => {
        SetBlocked(!BlockedFriend);
    }
    if (!userData) {
        return <LoadingComponent />;
    }
    return (
        <div className="
            body m-4 flex flex-col new:flex-row w-full h-[90vh] 
            justify-between gap-4 bg-inherit overflow-hidden 
            overflow-y-scroll no-scrollbar 
            Setting"
        >
            <div className="Acheivementpart flex flex-col  items-center  gap-4 w-full md:min-w-[35%]  no-scrollbar min-h-full overflow-hidden Usredit--Achievements ">


                <div className="w-[75%] update flex justify-center mt-4 items-center  dark:bg-black h-[25vh] bg-white border-gray-200  no-scrollbar rounded-lg shadow  overflow-hidden">
                    <div className="flex justify-end px-4 pt-4">


                        <div id="dropdown" className="z-10 hidden text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                            <ul className="py-2" aria-labelledby="dropdownButton">
                                <li>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Edit</a>
                                </li>
                                <li>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Export Data</a>
                                </li>
                                <li>
                                    <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex flex-col items-center  p-10 overflow-hidden  no-scrollbar mt-3">
                        <img className="w-24 h-auto  shadow-lg picture-user" src={user?.picture || picture} alt="Bonnie image" />
                        <h5 className=" text-xl h-[35px] overflow-hidden text-white-900 text-black dark:text-white font-bolder picture-user2">{user?.username}</h5>
                        <div className="flex gap-1 mt-2">

                            <FunctionAddFriend />
                            <a href="#" onClick={ButtonClick} className="inline-flex items-center px-4 py-2 text-sm h-auto overflow-hidden text-center text-black-950 font-bolder
                             bg-red-600 rounded-lg  focus:ring-4   ">
                                {BlockedFriend ? 'Blocked' : 'Block'}
                            </a>

                        </div>
                    </div>
                </div>
                <div className='w-[75%] flex flex-col gap-8 items-center h-[75vh] justify-center Achieve--Border dark:bg-black bg-white no-scrollbar '>
                    <h5 className='font-bolder text-gray-800 l5 '>ACHIEVEMENTS</h5>
                    <div className='Valid--Achievement flex flex-row  justify-center items-center  no-scrollbar '>
                        <img src={Achei} alt="" className='ml-2 w-[80px] h-[100%] ' />
                        <p className='flex flex-row justify-center items-center Center--paragraph'>Play The First Game</p>
                        <svg className="w-6 h-6 text-gray-800 dark:text-white svgIcon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2a3 3 0 0 0-2.1.9l-.9.9a1 1 0 0 1-.7.3H7a3 3 0 0 0-3 3v1.2c0 .3 0 .5-.2.7l-1 .9a3 3 0 0 0 0 4.2l1 .9c.2.2.3.4.3.7V17a3
                             3 0 0 0 3 3h1.2c.3 0 .5 0 .7.2l.9 1a3 3 0 0 0 4.2 0l.9-1c.2-.2.4-.3.7-.3H17a3 3 0 0 0 3-3v-1.2c0-.3 0-.5.2-.7l1-.9a3 3 0 0 0 0-4.2l-1-.9a1 1 0 0 1-.3-.7V7a3
                              3 0 0 0-3-3h-1.2a1 1 0 0 1-.7-.2l-.9-1A3 3 0 0 0 12 2Zm3.7 7.7a1 1 0 1 0-1.4-1.4L10 12.6l-1.3-1.3a1 1 0 0 0-1.4 1.4l2 2c.4.4 1 .4 1.4 0l5-5Z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className='Valid--Achievement flex flex-row   justify-center items-center'>
                        <img src={Achei1} alt="" className='ml-2 w-[80px] h-[100%]' />
                        <p className='flex flex-row justify-center items-center Center--paragraph'>win The First Game</p>
                        <svg className="w-6 h-6 text-gray-800 dark:text-white svgIcon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2a3 3 0 0 0-2.1.9l-.9.9a1 1 0 0 1-.7.3H7a3 3 0 0 0-3 3v1.2c0 .3 0 .5-.2.7l-1 .9a3 3 0 0 0 0 4.2l1 .9c.2.2.3.4.3.7V17a3 3 0 0 0 
                            3 3h1.2c.3 0 .5 0 .7.2l.9 1a3 3 0 0 0 4.2 0l.9-1c.2-.2.4-.3.7-.3H17a3 3 0 0 0 3-3v-1.2c0-.3 0-.5.2-.7l1-.9a3 3 0 0 0 0-4.2l-1-.9a1 1 0 0 1-.3-.7V7a3 3 0 0 0-3-3h-1.2a1
                             1 0 0 1-.7-.2l-.9-1A3 3 0 0 0 12 2Zm3.7 7.7a1 1 0 1 0-1.4-1.4L10 12.6l-1.3-1.3a1 1 0 0 0-1.4 1.4l2 2c.4.4 1 .4 1.4 0l5-5Z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className='Valid--Achievement flex flex-row  justify-center items-center'>
                        <img src={Achei2} alt="" className='ml-2 w-[80px] h-[100%]' />
                        <p className='flex flex-row justify-center items-center Center--paragraph'>win  with Max Score</p>
                        <svg className="w-6 h-6 text-gray-800 dark:text-white svgIcon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2a3 3 0 0 0-2.1.9l-.9.9a1 1 0 0 1-.7.3H7a3 3 0 0 0-3 3v1.2c0 .3 0 .5-.2.7l-1 .9a3 3 0 0 0 0 4.2l1 .9c.2.2.3.4.3.7V17a3 3 0 0 0 
                            3 3h1.2c.3 0 .5 0 .7.2l.9 1a3 3 0 0 0 4.2 0l.9-1c.2-.2.4-.3.7-.3H17a3 3 0 0 0 3-3v-1.2c0-.3 0-.5.2-.7l1-.9a3 3 0 0 0 0-4.2l-1-.9a1 1 0 0 1-.3-.7V7a3 3 0 0 0-3-3h-1.2a1
                             1 0 0 1-.7-.2l-.9-1A3 3 0 0 0 12 2Zm3.7 7.7a1 1 0 1 0-1.4-1.4L10 12.6l-1.3-1.3a1 1 0 0 0-1.4 1.4l2 2c.4.4 1 .4 1.4 0l5-5Z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className='Valid--Achievement flex flex-row  justify-center items-center'>
                        <img src={Achei3} alt="" className='ml-2 w-[80px] h-[100%]' />
                        <p className='flex flex-row justify-center items-center Center--paragraph'>Play First 5 Games</p>
                        <svg className="w-6 h-6 text-gray-800 dark:text-white svgIcon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2a3 3 0 0 0-2.1.9l-.9.9a1 1 0 0 1-.7.3H7a3 3 0 0 0-3 3v1.2c0 .3 0 .5-.2.7l-1 .9a3 3 0 0 0 0 4.2l1 .9c.2.2.3.4.3.7V17a3 3 0 0 0 3 
                            3h1.2c.3 0 .5 0 .7.2l.9 1a3 3 0 0 0 4.2 0l.9-1c.2-.2.4-.3.7-.3H17a3 3 0 0 0 3-3v-1.2c0-.3 0-.5.2-.7l1-.9a3 3 0 0 0 0-4.2l-1-.9a1 1 0 0 1-.3-.7V7a3 3 0 0 0-3-3h-1.2a1
                             1 0 0 1-.7-.2l-.9-1A3 3 0 0 0 12 2Zm3.7 7.7a1 1 0 1 0-1.4-1.4L10 12.6l-1.3-1.3a1 1 0 0 0-1.4 1.4l2 2c.4.4 1 .4 1.4 0l5-5Z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className='Valid--Achievement flex flex-row  justify-center items-center'>
                        <img src={Achei4} alt="" className='ml-2 w-[80px] h-[100%]' />
                        <p className='flex flex-row justify-center items-center Center--paragraph'>win First 5  Games</p>
                        <svg className="w-6 h-6 text-gray-800 dark:text-white svgIcon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2a3 3 0 0 0-2.1.9l-.9.9a1 1 0 0 1-.7.3H7a3 3 0 0 0-3 3v1.2c0 .3 0 .5-.2.7l-1 .9a3 3 0 0 0 0 4.2l1 .9c.2.2.3.4.3.7V17a3 3 0 0 0 3
                             3h1.2c.3 0 .5 0 .7.2l.9 1a3 3 0 0 0 4.2 0l.9-1c.2-.2.4-.3.7-.3H17a3 3 0 0 0 3-3v-1.2c0-.3 0-.5.2-.7l1-.9a3 3 0 0 0 0-4.2l-1-.9a1 1 0 0 1-.3-.7V7a3 3 0 0 0-3-3h-1.2a1
                              1 0 0 1-.7-.2l-.9-1A3 3 0 0 0 12 2Zm3.7 7.7a1 1 0 1 0-1.4-1.4L10 12.6l-1.3-1.3a1 1 0 0 0-1.4 1.4l2 2c.4.4 1 .4 1.4 0l5-5Z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className='Valid--Achievement flex flex-row  justify-center items-center'>
                        <img src={Achei5} alt="" className='ml-2 w-[80px] h-[100%]' />
                        <p className='flex flex-row justify-center items-center Center--paragraph'>Play The First Game</p>
                        <svg className="w-6 h-6 text-gray-800 dark:text-white svgIcon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2a3 3 0 0 0-2.1.9l-.9.9a1 1 0 0 1-.7.3H7a3 3 0 0 0-3 3v1.2c0 .3 0 .5-.2.7l-1 .9a3 3 0 0 0 0 4.2l1 .9c.2.2.3.4.3.7V17a3 3 0 0 0 3
                             3h1.2c.3 0 .5 0 .7.2l.9 1a3 3 0 0 0 4.2 0l.9-1c.2-.2.4-.3.7-.3H17a3 3 0 0 0 3-3v-1.2c0-.3 0-.5.2-.7l1-.9a3 3 0 0 0 0-4.2l-1-.9a1 1 0 0 1-.3-.7V7a3 3 0 0 0-3-3h-1.2a1
                              1 0 0 1-.7-.2l-.9-1A3 3 0 0 0 12 2Zm3.7 7.7a1 1 0 1 0-1.4-1.4L10 12.6l-1.3-1.3a1 1 0 0 0-1.4 1.4l2 2c.4.4 1 .4 1.4 0l5-5Z" clipRule="evenodd" />
                        </svg>
                    </div>


                </div>
            </div>
            <div className="ScorePart flex flex-col   gap-4 w-full md:min-w-[65%] min-h-full overflow-hidden no-scrollbar  justify-center items-center   ">


                <div className="w-[75%] flex flex-col justify-center items-center mt-4   gap-1  dark:bg-black bg-white h-[55vh] border-gray-200 rounded-lg shadow  dark:border-gray-700 
                overflow-hidden no-scrollbar math-info ">
                    <h5 className='font-bolder text-gray-800 l5 '>SCORE-MATCHES</h5>
                    
                    <div className='Score--Match flex gap-8 flex-row justify-center items-center mt-4 overflow-hidden no-scrollbar '>
                        <img
                            src={userData?.picture || picture} alt="" className='picture--User'
                            style={{ border: `2px solid ${userData?.coalitionColor} ` }} />

                        <div className='chi  no-scrollbar flex flex-row gap-2'>
                            <p className='ch w-[25px] flex justify-center items-center text-black bg-green-500'>5</p>
                            <p className='c  w-[25px] flex justify-center items-center text-black bg-red-600'>3</p>
                        </div>

                        <img
                            src={userData?.picture || picture} alt="" className='picture--User'
                            style={{ border: `2px solid ${userData?.coalitionColor} ` }} />
                    </div>
                    <div className='Score--Match flex gap-8 flex-row justify-center items-center mt-4 overflow-hidden no-scrollbar '>
                        <img
                            src={userData?.picture || picture} alt="" className='picture--User'
                            style={{ border: `2px solid ${userData?.coalitionColor} ` }} />

                        <div className='chi  no-scrollbar flex flex-row gap-2'>
                            <p className='ch w-[25px] flex justify-center items-center text-black bg-green-500'>5</p>
                            <p className='c  w-[25px] flex justify-center items-center text-black bg-red-600'>3</p>
                        </div>

                        <img
                            src={userData?.picture || picture} alt="" className='picture--User'
                            style={{ border: `2px solid ${userData?.coalitionColor} ` }} />
                    </div>
                    <div className='Score--Match flex gap-8 flex-row justify-center items-center mt-4 overflow-hidden no-scrollbar '>
                        <img
                            src={userData?.picture || picture} alt="" className='picture--User'
                            style={{ border: `2px solid ${userData?.coalitionColor} ` }} />

                        <div className='chi  no-scrollbar flex flex-row gap-2'>
                            <p className='ch w-[25px] flex justify-center items-center text-black bg-green-500'>5</p>
                            <p className='c  w-[25px] flex justify-center items-center text-black bg-red-600'>3</p>
                        </div>

                        <img
                            src={userData?.picture || picture} alt="" className='picture--User'
                            style={{ border: `2px solid ${userData?.coalitionColor} ` }} />
                    </div>
                    <div className='Score--Match flex gap-8 flex-row justify-center items-center mt-4 overflow-hidden no-scrollbar '>
                        <img
                            src={userData?.picture || picture} alt="" className='picture--User'
                            style={{ border: `2px solid ${userData?.coalitionColor} ` }} />

                        <div className='chi  no-scrollbar flex flex-row gap-2'>
                            <p className='ch w-[25px] flex justify-center items-center text-black bg-green-500'>5</p>
                            <p className='c  w-[25px] flex justify-center items-center text-black bg-red-600'>3</p>
                        </div>

                        <img
                            src={userData?.picture || picture} alt="" className='picture--User'
                            style={{ border: `2px solid ${userData?.coalitionColor} ` }} />
                    </div>
                    <div className='Score--Match flex gap-8 flex-row justify-center items-center mt-4 overflow-hidden no-scrollbar '>
                        <img
                            src={userData?.picture || picture} alt="" className='picture--User'
                            style={{ border: `2px solid ${userData?.coalitionColor} ` }} />

                        <div className='chi  no-scrollbar flex flex-row gap-2'>
                            <p className='ch w-[25px] flex justify-center items-center text-black bg-green-500'>5</p>
                            <p className='c  w-[25px] flex justify-center items-center text-black bg-red-600'>3</p>
                        </div>

                        <img
                            src={userData?.picture || picture} alt="" className='picture--User'
                            style={{ border: `2px solid ${userData?.coalitionColor} ` }} />
                    </div>

                </div>
                <div className="w-[75%] flex flex-col mt-4 justify-center items-center  dark:bg-black bg-white h-[25vh] border-gray-200 rounded-lg shadow  dark:border-gray-700 update">


                    <h5 className='font-bolder text-gray-800 l5 '>PROGRESS-USER</h5>
                    <div className='flex flex-row justify-center items-center gap-4 mr-8 overflow-hidden no-scrollbar prof-user '>
                        <CreatChartDesign></CreatChartDesign>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FunctionProfileForm;



