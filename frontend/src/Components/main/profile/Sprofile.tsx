// import DataContext from '../../../services/data.context';

import { useContext } from "react";
import DataContext from "../../../services/data.context";
// import './Sprofile.css';
import "./list.css";
// import './profile.css'
/*
export default function FunctionSprofileForm(): JSX.Element {
    const userData = useContext(DataContext);
    console.log(userData);
    return (
        <div className="Sc">
            <div className="Sprofile pr1 ">
                <div className='form-content overflow-y-scroll no-scrollbar'>
                    <div className='titleprofile2 mt-2 ' 
                        // style={{ backgroundColor: `${userData.coalitionCover || }` }} 
                        >

                        <img 
                            // src={userData.coalitionPic || ''} alt="" 
                            className='im-list2' 
                            // style={{ backgroundColor: `${userData.coalitionColor || ''}` }} 
                            />
                    </div>
                    <img 
                        className="logSing" 
                        // src={userData.picture} alt="Bordered avatar" 
                        // style={{ border: `5px solid ${userData.coalitionColor || ''}` }} 
                    />
                    <div className="relative mt-[-2px] grid place-items-center">

                    </div>
                </div>
            </div>
            <div className="Sprofile pr2"></div>
            <div className="Sprofile pr3"></div>
            <div className="Sprofile pr4"></div>
        </div>
    )
}
*/

export default function prof() {
    return (
        // <div className='Sc2 overflow-scroll no-scrollbar flex flex-row w-fill h-fill justify-between gap-2 bg-red-300'>
        <div className="body m-4 flex flex-col new:flex-row w-full h-[90vh] justify-between gap-4 bg-inherit ">
            <div className="part1 flex flex-col md:flex-row gap-4 w-full md:min-w-[50%] min-h-full">
                <div className="bg-gray-600 h-full w-full">
                    <div className="form-content overflow-scroll no-scrollbar">
                        <div className="titleprofile2"></div>
                    </div>
                </div>
                <div className="bg-green-300 h-full w-full">
                    <div className="form-content overflow-scroll no-scrollbar">
                        <div className="titleprofile2"></div>
                    </div>
                </div>
            </div>
            <div className="part2 flex flex-col md:flex-row gap-4 w-full md:min-w-[50%] min-h-full">
                <div className="bg-red-300 h-full w-full">
                    <div className="form-content overflow-scroll no-scrollbar">
                        <div className="titleprofile2"></div>
                    </div>
                </div>
                <div className="bg-rose-900 h-full w-full">
                    <div className="form-content overflow-scroll no-scrollbar">
                        <div className="titleprofile2"></div>
                    </div>
                </div>
            </div>
        </div>
    


    );
}
