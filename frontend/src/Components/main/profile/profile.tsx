
import { useContext } from 'react';
// import DataContext from '../../../services/data.context';
import './profile.css';
import FrinedsFormUserPage from './Friends-game';
import DataContext from '../../../services/data.context';
// import { color } from 'framer-motion';

/*

import { Button } from 'flowbite-react';

function Component() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button gradientDuoTone="purpleToBlue">Purple to Blue</Button>
      <Button gradientDuoTone="cyanToBlue">Cyan to Blue</Button>
      <Button gradientDuoTone="greenToBlue">Green to Blue</Button>
      <Button gradientDuoTone="purpleToPink">Purple to Pink</Button>
      <Button gradientDuoTone="pinkToOrange">Pink to Orange</Button>
      <Button gradientDuoTone="tealToLime">Teal to Lime</Button>
      <Button gradientDuoTone="redToYellow">Red to Yellow</Button>
    </div>
  );
}
*/
function FunctionProfileForm() {
    const userData = useContext(DataContext);
    console.log(userData);
    return (
        <section className={`new_c`}
        >

            <FrinedsFormUserPage />
            <div className="cont2 overflow-y-scroll no-scrollbar" >
                <div className="list1">
                    {/* Login Form */}
                    <div className="formProfile login overflow-y-scroll no-scrollbar"> 
                        <div className="form-content ">

                            <div className='title-profile' style={{ backgroundColor: `${userData.coalitionCover || ''}` }} >

                                <img src={userData.coalitionPic || ''} alt="" className='im-list' style={{ backgroundColor: `${userData.coalitionColor || ''}` }} />
                            </div>
                            <img className="logSing  " src={userData.picture} alt="Bordered avatar" style={{ border: `5px solid ${userData.coalitionColor || ''}` }} />
                            <div className="relative mt-[-2px] grid place-items-center">

                            </div>
                            <form action="#">
                                <div className="mt-0">
                                    <form>
                                        <div className="grid gap-0 mb-0 lg:grid-cols-0 list">
                                            <div>
                                                <label htmlFor="first_name" className="list block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" style={{ color: `${userData.coalitionColor || ''}` }}>First name</label>
                                                <p   id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.25 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  >{userData.firstName}</p>
                                            </div>
                                            <div>
                                                <label htmlFor="last_name" className="list block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" style={{ color: `${userData?.coalitionColor || ''}` }}>Last name</label>
                                                <input type="text" disabled id="last_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={userData.lastName} required />
                                            </div>
                                            <div>
                                                <label htmlFor="company" className="list block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" style={{ color: `${userData.coalitionColor || ''}` }}>UserName</label>
                                                <input type="text" disabled id="company" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={userData.username} required />
                                            </div>

                                            <div>
                                                <label htmlFor="website" className="list block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" style={{ color: `${userData.coalitionColor || ''}` }}>Profile Intra</label>
                                                <input type="url" disabled id="website" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                                                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={userData.email} required />
                                            </div>
                                        </div>
                                        <div className="mb-6">
                                            <label htmlFor="email" className="list block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" style={{ color: `${userData.coalitionColor || ''}` }}>Email address</label>
                                            <input type="email" disabled id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={userData.coalition} required />
                                        </div>

                                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" style={{ backgroundColor: `${userData.coalitionColor || ''}` }}>Profile Intra</button>
                                    </form>
                                </div>
                            </form>
                        </div>
                    </div>
                    {/* Signup Form */}
                </div>
                <div className="ColorSwitch2">
                    <span   style={{backgroundColor: 'green'}}></span>
                    <span className='active' style={{backgroundColor: 'blue'}}></span>
                </div>
                {/* Placeholder for form2 content */}
            </div>
        </section>
    );
}

export default FunctionProfileForm;


