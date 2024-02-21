import { useContext, useState } from 'react';
import './chat.css'
import DataContext from '../../../services/data.context';
import LoadingComponent from '../../shared/loading/loading';
import { FlowbiteTheme, TextInput } from 'flowbite-react';
import { HiOutlineEmojiHappy } from "react-icons/hi";
import conversationArea from './conversation';
import messageUser from '../../../model/messageUser.model';
import detailsArea from './details';
// const inputTheme: FlowbiteTheme['textInput'] = {
//     base: 'flex',
//     field: {

//         colors: {
//     }
//     gray: 'bg-zinc-900',
// }
    
function chatComponent(): JSX.Element {
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
            <div className="flex w-full h-[100%]">
                <div className="conversation-area">
                    {conversationArea(latestMessages)}
                </div>
                <div className="chat-area  flex flex-col overflow-auto flex-1">
                    <div className="flex-1">
                        <div className="chat-area-header flex sticky top-0 left-0 z-10 overflow-hidden w-full items-center justify-between p-5 bg-zinc-800">
                            <div className="chat-area-title text-lg font-semibold">PINGPONG Group</div>
                            <div className="chat-area-group">
                                <img className="chat-area-profile" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%283%29+%281%29.png" alt="" />
                                <img className="chat-area-profile" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%282%29.png" alt="" />
                                <img className="chat-area-profile" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%2812%29.png" alt="" />
                                <span className='w-8 h-8 bg-slate-200 rounded-full flex justify-center items-center font-normal text-sm'>+4</span>
                            </div>
                        </div>
                        <div className="chat-area-main mt-2">
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
                    <div className="footer self-end flex  border-t-2 bg-zinc-900 border-t-white flex-row items-center w-full overflow-hidden" style={{ padding: '10px 20px' }}>
                            <TextInput className='p-2 w-full' type="text" icon={HiOutlineEmojiHappy} rightIcon={HiOutlineEmojiHappy}  />
                    </div>
                </div>
                <div className="detail-area">
                    {detailsArea(latestMessages)}
                </div>
            </div>
        </>
    )
}

export default chatComponent;