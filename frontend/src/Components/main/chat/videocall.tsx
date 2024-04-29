import { useState } from 'react';
import User from '../../../model/user.model';

interface componentProps {
    user: User
}

const VideoCallComponent : React.FC<componentProps> = ({user}) => {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const baseApiUrl = import.meta.env.VITE_API_AUTH_KEY;
    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };

    return (
            <div className={`relative w-full p-4 ${isFullScreen ? 'fixed top-0 left-0 right-0 bottom-0 bg-black z-50' : ''}`}>
                <div className={`flex flex-col justify-between items-center p-2  ${isFullScreen ? 'h-full' : 'h-96'}`}>
                    <div className="users flex flex-row justify-start items-center p-2 gap-6">
                        <div className="user1 w-auto h-auto p-2">
                            <div className="roundedborder p-1 rounded-full ring-4 ring-green-600">
                                <div className="pic-user">
                                    <img src={baseApiUrl + user.picture} alt="user" className="w-20 h-20 object-cover rounded-full" />
                                </div>
                            </div>
                        </div>
                        <div className="user2 w-auto h-auto p-2">
                            <div className="rounded-full p-1 ring-4 ring-red-600 overflow-hidden">
                                <div className="pic-user ring-animation">
                                    <img src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg" alt="user" className="w-20 h-20 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="footer self-end">
                        <svg onClick={toggleFullScreen} className="self-start w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 4h4m0 0v4m0-4-5 5M8 20H4m0 0v-4m0 4 5-5"/>
                        </svg>
                    </div>
                </div>
            </div>
    );
}

export default VideoCallComponent;
