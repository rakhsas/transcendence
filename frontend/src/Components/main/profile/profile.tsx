
import { useContext, useEffect, useState } from 'react';
// import DataContext from '../../../services/data.context';

import DataContext from '../../../services/data.context';
import Achei from '../../../assets/acheivements/poker.png'
import Achei2 from '../../../assets/acheivements/fire.png'
import Achei3 from '../../../assets/acheivements/fire3.png'
import Achei4 from '../../../assets/acheivements/fire2.png'
import Achei1 from '../../../assets/acheivements/poker1.png'
import './updateprofile.css'
import CreatChartDesign from './Chart';
import picture from './mdarify.png'
import { useNavigate } from 'react-router-dom';
import LoadingComponent from '../../shared/loading/loading';
import User from '../../../model/user.model';

interface ButtonAttributes {
    className: string;
    value: string;
    onClick?: () => void;
}

function FunctionAddFriend() {
    const path = window.location.pathname
    
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
        value: '+ Friend',
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
    const [user, setUser] = useState<any>();
    const [friends, setFriends] = useState<User[]>();
    const [users, setUsers] = useState<User[]>();
    const [BlockedFriend, SetBlocked] = useState<boolean>(false);
    useEffect(() => {
        if (!userData) {
            return;
        }
        let routepath = window.location.pathname;
        setId(routepath.split('/').findLast((item: any) => item) || '');
        setUser(userData[0]);
        setUsers(userData[3]);
        setFriends(userData[7]);
    }, [userData, friends, users]);
    useEffect(() => {
        if (id !== 'profile' && user && friends) {
            const requestedUser = users?.find((u) => u.id === id);
            setUser(requestedUser);
    
            if (requestedUser) {
                const isFriend = friends.some((friend) => friend.id === requestedUser.id);
                setUser((prevUser: User) => ({
                    ...prevUser,
                    isFriend: isFriend
                }));
            }
        }
    }, [id]);
    const ButtonClick = () => {
        SetBlocked(!BlockedFriend);
    }   
    if (!userData) {
        return <LoadingComponent />;
    }
    const sendFriendRequest = () => {
        console.log(user)
    }
    return (
        <div className="body m-4 flex flex-col new:flex-row w-full h-[90vh] justify-between gap-4 bg-inherit overflow-visible Setting">
            <div className="Acheivementpart flex flex-col  items-center  gap-4 w-full md:min-w-[35%]  min-h-full overflow-hidden Usredit--Achievements ">
                <div className="w-full md:w-[85%] p-4 flex justify-center mt-4 items-center dark:bg-zinc-900 bg-[#F1F2FD] border-gray-200 no-scrollbar rounded-lg shadow overflow-hidden">
                    <div className="flex flex-col p-2 items-center w-full">
                        <div className="flex justify-center items-center p-1 w-full">
                            <div className={`relative border-2 rounded-full `} style={{
                                borderColor: user?.coalitionColor,
                            }}>
                                <img alt={user?.username} src={user?.picture} className="w-20 h-20" />
                            </div>
                        </div>
                        <div className="py-4">
                            <h5 className="text-xl text-black dark:text-white font-bolder font-poppins">{user?.firstName + ' ' + user?.lastName}</h5>
                        </div>
                        {
                            id && id !== 'profile' && (
                                <div className="flex flex-1 flex-wrap justify-center items-center w-full py-2">
                                    {
                                        user && user.isFriend === false ? (
                                            <button type="button" className="dark:text-white text-black bg-yellow-300 hover:bg-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2 mb-2 me-2 dark:focus:ring-yellow-900" onClick={
                                                () => sendFriendRequest()
                                            }>
                                                Send Friend Request
                                            </button>
                                        ) : (
                                            <button type="button" className="dark:text-white text-black bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2 mb-2 me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Block</button>
                                        )
                                        
                                    }
                                    {/* <button type="button" className="dark:text-white text-black bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Friend</button> */}
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className='w-[85%] flex flex-col p-4 gap-4 items-center h-[75vh] dark:bg-zinc-900 bg-[#F1F2FD]'>
                    <div className="header overflow-hidden">
                        <h5 className='font-bolder dark:text-main-light-FERN text-main-light-EGGSHELL font-poppins'>ACHIEVEMENTS</h5>
                    </div>
                    <div className="achievements flex flex-col gap-4 w-full">
                        <div className='flex flex-row  justify-between items-center'>
                            <img src={Achei} className='ml-2 w-16 h-16' />
                            <p className='flex flex-row justify-center items-center dark:text-white text-black'>Play The First Game</p>
                            {/* <svg  aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M12 2a3 3 0 0 0-2.1.9l-.9.9a1 1 0 0 1-.7.3H7a3 3 0 0 0-3 3v1.2c0 .3 0 .5-.2.7l-1 .9a3 3 0 0 0 0 4.2l1 .9c.2.2.3.4.3.7V17a3
                                3 0 0 0 3 3h1.2c.3 0 .5 0 .7.2l.9 1a3 3 0 0 0 4.2 0l.9-1c.2-.2.4-.3.7-.3H17a3 3 0 0 0 3-3v-1.2c0-.3 0-.5.2-.7l1-.9a3 3 0 0 0 0-4.2l-1-.9a1 1 0 0 1-.3-.7V7a3
                                3 0 0 0-3-3h-1.2a1 1 0 0 1-.7-.2l-.9-1A3 3 0 0 0 12 2Zm3.7 7.7a1 1 0 1 0-1.4-1.4L10 12.6l-1.3-1.3a1 1 0 0 0-1.4 1.4l2 2c.4.4 1 .4 1.4 0l5-5Z" clipRule="evenodd" />
                            </svg> */}
                            {/* <svg className="w-6 h-6 dark:text-main-light-FERN text-main-light-EGGSHELL svgIcon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                            </svg> */}
                            <svg className="w-6 h-6 dark:text-main-light-FERN text-main-light-EGGSHELL svgIcon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                            </svg>


                        </div>
                    </div>
                    


                </div>
            </div>
            <div className="ScorePart flex flex-col   gap-4 w-full md:min-w-[65%] min-h-full overflow-hidden no-scrollbar  justify-center items-center   ">


                <div className="w-[75%] flex flex-col justify-center items-center mt-4   gap-1  dark:bg-zinc-900 bg-[#F1F2FD] h-[65%] border-gray-200 rounded-lg shadow  dark:border-gray-700 
                overflow-hidden no-scrollbar math-info ">
                    <h5 className='font-bolder text-gray-800 l5 '>SCORE-MATCHES</h5>
                    
                    <div className='Score--Match flex gap-8 flex-row justify-center items-center mt-4 overflow-hidden no-scrollbar '>
                        <img
                            src={userData[0]?.picture || picture} alt="" className='picture--User'
                            style={{ border: `2px solid ${userData[0]?.coalitionColor} ` }} />

                        <div className='chi  no-scrollbar flex flex-row gap-2'>
                            <p className='ch w-[25px] flex justify-center items-center text-black bg-green-500'>5</p>
                            <p className='c  w-[25px] flex justify-center items-center text-black bg-red-600'>3</p>
                        </div>

                        <img
                            src={userData[0]?.picture || picture} alt="" className='picture--User'
                            style={{ border: `2px solid ${userData[0]?.coalitionColor} ` }} />
                    </div>
                    <div className='Score--Match flex gap-8 flex-row justify-center items-center mt-4 overflow-hidden no-scrollbar '>
                        <img
                            src={userData[0]?.picture || picture} alt="" className='picture--User'
                            style={{ border: `2px solid ${userData[0]?.coalitionColor} ` }} />

                        <div className='chi  no-scrollbar flex flex-row gap-2'>
                            <p className='ch w-[25px] flex justify-center items-center text-black bg-green-500'>5</p>
                            <p className='c  w-[25px] flex justify-center items-center text-black bg-red-600'>3</p>
                        </div>

                        <img
                            src={userData[0]?.picture || picture} alt="" className='picture--User'
                            style={{ border: `2px solid ${userData[0]?.coalitionColor} ` }} />
                    </div>
                    <div className='Score--Match flex gap-8 flex-row justify-center items-center mt-4 overflow-hidden no-scrollbar '>
                        <img
                            src={userData[0]?.picture || picture} alt="" className='picture--User'
                            style={{ border: `2px solid ${userData[0]?.coalitionColor} ` }} />

                        <div className='chi  no-scrollbar flex flex-row gap-2'>
                            <p className='ch w-[25px] flex justify-center items-center text-black bg-green-500'>5</p>
                            <p className='c  w-[25px] flex justify-center items-center text-black bg-red-600'>3</p>
                        </div>

                        <img
                            src={userData[0]?.picture || picture} alt="" className='picture--User'
                            style={{ border: `2px solid ${userData[0]?.coalitionColor} ` }} />
                    </div>
                    <div className='Score--Match flex gap-8 flex-row justify-center items-center mt-4 overflow-hidden no-scrollbar '>
                        <img
                            src={userData[0]?.picture || picture} alt="" className='picture--User'
                            style={{ border: `2px solid ${userData[0]?.coalitionColor} ` }} />

                        <div className='chi  no-scrollbar flex flex-row gap-2'>
                            <p className='ch w-[25px] flex justify-center items-center text-black bg-green-500'>5</p>
                            <p className='c  w-[25px] flex justify-center items-center text-black bg-red-600'>3</p>
                        </div>

                        <img
                            src={userData[0]?.picture || picture} alt="" className='picture--User'
                            style={{ border: `2px solid ${userData[0]?.coalitionColor} ` }} />
                    </div>
                    <div className='Score--Match flex gap-8 flex-row justify-center items-center mt-4 overflow-hidden no-scrollbar '>
                        <img
                            src={userData[0]?.picture || picture} alt="" className='picture--User'
                            style={{ border: `2px solid ${userData[0]?.coalitionColor || 'green'} ` }} />

                        <div className='chi  no-scrollbar flex flex-row gap-2'>
                            <p className='ch w-[25px] flex justify-center items-center text-black bg-green-500'>5</p>
                            <p className='c  w-[25px] flex justify-center items-center text-black bg-red-600'>3</p>
                        </div>

                        <img
                            src={userData[0]?.picture || picture} alt="" className='picture--User'
                            style={{ border: `2px solid ${userData[0]?.coalitionColor} ` }} />
                    </div>

                </div>
                <div className="w-[75%] flex flex-col mt-4 justify-center items-center  dark:bg-zinc-900 bg-[#F1F2FD] h-[35%] border-gray-200 rounded-lg shadow  dark:border-gray-700 update">


                    <h5 className='font-bolder text-gray-800 l5 flex-row '>PROGRESS-USER</h5>
                    <div className='flex flex-row justify-center items-center gap-4 mr-2 overflow-hidden no-scrollbar prof-user '>
                        <CreatChartDesign></CreatChartDesign>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FunctionProfileForm;



