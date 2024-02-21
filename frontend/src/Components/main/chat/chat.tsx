import { useContext, useState } from 'react';
import './chat.css'
import DataContext from '../../../services/data.context';
import LoadingComponent from '../../shared/loading/loading';
import { CustomFlowbiteTheme, TextInput } from 'flowbite-react';
import { HiOutlineEmojiHappy } from "react-icons/hi";
import conversationArea from './conversation';
import messageUser from '../../../model/messageUser.model';
import detailsArea from './details';
import send from './../../../assets/Icon/send.svg';
const inputTheme: CustomFlowbiteTheme['textInput'] = {
    base: 'flex',
    field: {
        input: {
            colors: {
                primary: 'bg-zinc-900 text-gray-200 placeholder-gray-700 focus:border-1 focus:border-white',
            }
        }
    }
}
    
function chatComponent(): JSX.Element {
    const [selectedColor, setSelectedColor] = useState("blue");
    const userData = useContext(DataContext);
    if (!userData) {
        return <LoadingComponent />;
    }
    const latestMessages: messageUser[] = [
        {
            profile: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%2812%29.png',
            username: 'Madison Jones',
            message: 'What time was our meet',
            date: '20m',
            status: 'online',
        },
        {
            profile: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%2812%29.png',
            username: 'Madison Jones',
            message: 'What time was our meet',
            date: '20m',
            status: 'active',
        },
        {
            profile: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%284%29+%281%29.png',
            username: 'Madison Jones',
            message: 'What time was our meet',
            date: '0s',
            status: '',
        },
    ];
    const messages = [
        {
            profile: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%281%29.png',
            date: 'Message seen 1.22pm',
            username: 'Madison Jones',
            message: 'Wa fen cv',
            // img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%283%29+%281%29.png'
        },
        {
            profile: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%281%29.png',
            date: 'Message seen 1.22pm',
            username: 'Madison Jones',
            // message: 'Wa fen cv',
            img: 'https://banner2.cleanpng.com/20190223/bqv/kisspng-fc-barcelona-logo-vector-graphics-football-image-5c71e478167a69.5648857315509679280921.jpg'
        },
        {
            profile: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%281%29.png',
            date: 'Message seen 1.22pm',
            username: 'Madison Jones',
            message: 'Wa fen cv',
            // img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%283%29+%281%29.png'
        },
        {
            profile: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%281%29.png',
            date: 'Message seen 1.22pm',
            username: 'Madison Jones',
            // message: 'Wa fen cv',
            img: 'https://banner2.cleanpng.com/20190223/bqv/kisspng-fc-barcelona-logo-vector-graphics-football-image-5c71e478167a69.5648857315509679280921.jpg'
        },
    ]
    return (
        <>
            <div className="flex w-full h-[100%] border-t-[1px] border-gray-700">
                <div className="conversation-area">
                    {conversationArea(latestMessages)}
                </div>
                <div className="chat-area  flex flex-col overflow-auto flex-1">
                    <div className="flex-1">
                        <div className="chat-area-header flex sticky top-0 left-0 z-10 overflow-hidden w-full items-center justify-between p-5 bg-zinc-800">
                            <div className="chat-area-title text-lg font-semibold font-onest">PINGPONG Group</div>
                            <div className="chat-area-group">
                                <img className="chat-area-profile" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%283%29+%281%29.png" alt="" />
                                <img className="chat-area-profile" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%282%29.png" alt="" />
                                <img className="chat-area-profile" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%2812%29.png" alt="" />
                                <span className='w-8 h-8 bg-slate-200 rounded-full flex justify-center items-center font-normal text-sm'>+4</span>
                            </div>
                        </div>
                        <div className={`chat-area-main p-1 ${selectedColor}`}>
                            {
                                messages.map((message, index) => (
                                    <div className="chat-msg  " key={index}>
                                        <div className="chat-msg-profile ">
                                            <img className="chat-msg-img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%283%29+%281%29.png" alt="" />
                                        </div>
                                        <div className="chat-msg-content ">
                                            {
                                                (message.img! && message.img != '')
                                                ?
                                                <div className="chat-msg-text bg-main-light-FERN text-white">
                                                    <img src={message.img} alt="" />
                                                </div>
                                            : 
                                            <div className="chat-msg-text bg-main-light-FERN text-white">{message.message}</div>
                                        }
                                        <div className="chat-msg-date">Message seen 1.22pm</div>
                                        </div>
                                    </div>

                                ))
                            }
                            <div className="chat-msg owner">
                                <div className="chat-msg-profile">
                                    <img className="chat-msg-img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%281%29.png" alt="" />
                                </div>
                                <div className="chat-msg-content">
                                    <div className="chat-msg-text bg-main-light-FERN text-white">WA TA SIR T9AWED😂😂😂</div>
                                    <div className="chat-msg-text bg-main-light-FERN text-white">Cras mollis nec arcu malesuada tincidunt.</div>
                                    <div className="chat-msg-date">Message seen 1.22pm</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="footer flex bg-zinc-900 border-t-2   border-t-gray-500 flex-row items-center w-full overflow-hidden" style={{ padding: '10px 20px' }}>
                        <TextInput className='p-2 w-full' type="text" theme={inputTheme} color={'primary'} placeholder='Type something here...'  />
                        <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="32px" height="32px"><path d="M 5.4453125 4.0019531 A 1.50015 1.50015 0 0 0 4.109375 6.0644531 L 11.380859 24 L 4.109375 41.935547 A 1.50015 1.50015 0 0 0 6.1699219 43.841797 L 43.169922 25.341797 A 1.50015 1.50015 0 0 0 43.169922 22.658203 L 6.1699219 4.1582031 A 1.50015 1.50015 0 0 0 5.4453125 4.0019531 z M 8.3828125 8.6191406 L 39.146484 24 L 8.3828125 39.380859 L 14.011719 25.5 L 27.5 25.5 A 1.50015 1.50015 0 1 0 27.5 22.5 L 14.011719 22.5 L 8.3828125 8.6191406 z" fill='white'/></svg>
                    </div>
                </div>
                <div className="detail-area">
                    {/* {detailsArea(latestMessages)} */}
                    <div className="detail-area-header">
                <div className="msg-profile group">
                    <img src={latestMessages[1].profile} alt="" />
                </div>
                <div className="detail-title">{latestMessages[1].username}</div>
                <div className="detail-subtitle">Created by Aysenur</div>
                <div className="detail-buttons">
                    <button className="detail-button">
                        <svg
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="0"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-phone"
                        >
                            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                        </svg>
                        Call Group
                    </button>
                    <button className="detail-button">
                        <svg
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="0"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-video"
                        >
                            <path d="M23 7l-7 5 7 5V7z" />
                            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                        </svg>
                        Video Chat
                    </button>
                </div>
            </div>
            <div className="detail-changes">
                <input type="text" placeholder="Search in Conversation" />
                <div className="detail-change">
                    Change Color
                    <div className="colors">
                        <div
                            className={`color blue ${selectedColor === "blue" ? "selected" : ""
                                }`}
                            data-color="blue"
                            onClick={() => setSelectedColor("")}
                        ></div>
                        <div
                            className={`color purple ${selectedColor === "purple" ? "selected" : ""
                                }`}
                            data-color="purple"
                            onClick={() => setSelectedColor("purple")}
                        ></div>
                        <div
                            className={`color green ${selectedColor === "green" ? "selected" : ""
                                }`}
                            data-color="green"
                            onClick={() => setSelectedColor("green")}
                        ></div>
                        <div
                            className={`color orange ${selectedColor === "orange" ? "selected" : ""
                                }`}
                            data-color="orange"
                            onClick={() => setSelectedColor("orange")}
                        ></div>
                    </div>
                </div>
                {/* <div className="detail-change">
                    Change Emoji
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-thumbs-up"
                    >
                        <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
                    </svg>
                </div> */}
            </div>
            <div className="detail-photos">
                <div className="detail-photo-title">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-image"
                    >
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                    </svg>
                    Shared photos
                </div>
                <div className="detail-photo-grid">
                    <img src="https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2168&q=80" />
                    <img src="https://images.unsplash.com/photo-1516085216930-c93a002a8b01?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80" />
                    <img src="https://images.unsplash.com/photo-1458819714733-e5ab3d536722?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=933&q=80" />
                    <img src="https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2287&q=80" />
                    <img src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2247&q=80" />
                    <img src="https://images.unsplash.com/photo-1559181567-c3190ca9959b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1300&q=80" />
                    <img src="https://images.unsplash.com/photo-1560393464-5c69a73c5770?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1301&q=80" />
                    <img src="https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2249&q=80" />
                    <img src="https://images.unsplash.com/photo-1481349518771-20055b2a7b24?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2309&q=80" />

                    <img src="https://images.unsplash.com/photo-1473170611423-22489201d919?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2251&q=80" />
                    <img src="https://images.unsplash.com/photo-1579613832111-ac7dfcc7723f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80" />
                    <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2189&q=80" />
                </div>
                <div className="view-more">View More</div>
            </div>
                </div>
            </div>
        </>
    )
}

export default chatComponent;