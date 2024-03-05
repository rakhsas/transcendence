import { useContext } from "react";
import DataContext from "../../../services/data.context";
import LoadingComponent from "../../shared/loading/loading";
import { CustomFlowbiteTheme, Progress } from "flowbite-react";

function FunctionProfileForm() {
    const active = "#B8F170"
    const inactive = "#e0a91d"
    const userData = useContext(DataContext)
    // if (!userData) {
    //     return <LoadingComponent />;
    // }
    const customProgressTheme: CustomFlowbiteTheme['progress'] = {
        color: {
            primary: `bg-[${userData.coalitionColor}]`,
            secondary: 'bg-yellow-500',
        },
        bar: `rounded-full text-center font-medium leading-none space-x-2`,
        base: `w-64 overflow-hidden rounded-full bg-white dark:bg-gray-700`,
        label: "mb-1 flex justify-between font-medium dark:text-white",
    }
    return (
        <div className="h-screen">
            <aside className="bg-main-light-SPRUCE p-8 border-2 rounded-lg lg:block md:block hidden">
                <div className="w-96 h-96 border-white border-2 bg-cover overflow-hidden" style={{ backgroundImage: `url(${userData.coalitionCover})` }}>
                    <div className="flex flex-col w-full sm:gap-3 justify-between p-4">
                        <div className="flex flex-col lg:flex-row">
                            <div className="grid place-items-center relative">
                                <div
                                    className="w-48 h-48 text-black md:w-36 md:h-36 lg:h-24 lg:w-24 bg-cover bg-no-repeat bg-center rounded-full bg-gray-300 border-2 shadow-base"
                                    style={{ backgroundImage: `url(${userData.picture})`, borderColor: `${userData.coalitionColor}`, borderWidth: '3px' }}>
                                </div>
                                <a>
                                    <div className="relative mt-[-2px] grid place-items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="banner" x="0px" y="0px" width="70" height="70" viewBox="0 0 68 104" fill={userData ? userData.coalitionColor : '#000'} xmlSpace="preserve" className="coalition-flag--flag">
                                            <g id="banner-content">
                                                <g id="UI-Intranet-banner-content" transform="translate(-96.000000, -60.000000)">
                                                    <g id="banner-content-g-1" transform="translate(96.000000, 60.000000)">
                                                        <polygon id="banner-content-polygon-1" points="0,0 0,80.5 34.3,104 68,80.5 68,0"></polygon>
                                                    </g>
                                                </g>
                                            </g>
                                            <foreignObject x="0" y="0" width="68" height="50" >
                                                <img src={userData.coalitionPic} alt="" />
                                            </foreignObject>
                                        </svg>
                                    </div>
                                </a>
                            </div>
                            <div className="lg:pl-2 overflow-hidden">
                                <h2 className="text-2xl text-white font-bold text-center py-4 lg:text-left lg:py-0 drop-shadow-md">
                                    {userData.firstName + ' ' + userData.lastName}
                                </h2>
                                <p className="text-sm text-white lg:text-black">
                                    {userData.username}
                                </p>
                                <div className="text-sm flex flex-row items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="#B8F170" stroke="#10742C">
                                        <circle cx="5" cy="5" r="4" fill={inactive} stroke="#000"></circle>
                                    </svg>
                                    <div className="drop-shadow-md text-white">Status</div></div>
                            </div>
                            <div className="flex flex-col gap-6 lg:gap-3">
                                <Progress
                                    theme={customProgressTheme}
                                    progress={50}
                                    color='primary'
                                    progressLabelPosition="inside"
                                    size="xl"
                                    labelProgress
                                    labelText
                                    textLabel='Level 0'
                                />
                            </div>
                        </div>
                        {/* Add other elements */}
                    </div>
                </div>
                <div className="activity"></div>
            </aside>
        </div>
        // <section className={`new_c`}
        // >

            // <FrinedsFormUserPage />

            // </section>
            );
        }
        
        {/* <div className="container2" >
            <div className="list1">
              
                <div className="form login">
                    <div className="form-content">
                        <div className='title-profile' style={{ backgroundColor: `${userData.coalitionCover}` }} >

                            <img src={userData.coalitionPic} alt="" className='im-list' style={{ backgroundColor: `${userData.coalitionColor}` }} />
                        </div>

                        <img className="logSing"  src={userData.picture} alt="Bordered avatar" />

                        <form action="#">
                            <div className="mt-0">
                                <form>
                                    <div className="grid gap-0 mb-0 lg:grid-cols-0 list">
                                        <div>
                                            <label htmlFor="first_name" className="list block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">First name</label>
                                            <input type="text" disabled id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.25 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={userData.firstName} required />
                                        </div>
                                        <div>
                                            <label htmlFor="last_name" className="list block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Last name</label>
                                            <input type="text" disabled id="last_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={userData.lastName} required />
                                        </div>
                                        <div>
                                            <label htmlFor="company" className="list block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">UserName</label>
                                            <input type="text" disabled id="company" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={userData.username} required />
                                        </div>

                                        <div>
                                            <label htmlFor="website" className="list block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Profile Intra</label>
                                            <input type="url" disabled id="website" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={userData.email} required />
                                        </div>
                                    </div>
                                    <div className="mb-6">
                                        <label htmlFor="email" className="list block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Email address</label>
                                        <input type="email" disabled id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={userData.coalition} required />
                                    </div>

                                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Profile Intra</button>
                                </form>
                            </div>
                        </form>
                    </div>
                </div>
              
            </div>
            
        </div> */}
export default FunctionProfileForm;