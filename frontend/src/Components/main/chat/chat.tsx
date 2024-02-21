import './chat.css'
function chatComponent(): JSX.Element {
    const latestMessages = [
        {
            profile: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%281%29.png',
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
            date: '20m',
            status: '',
        },
        
        // Add more message objects here
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
            img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%283%29+%281%29.png'
        },
    ]
    return (
        <>
            <div className="wrapper flex flex-1 overflow-hidden">
                <div className="conversation-area">
                    {latestMessages.map((message, index) => (
                        <div key={index} className={`msg ${message.status}`}>
                            <div className="msg-profile rounded-full object-cover mr-4 bg-rose-400">
                                {message.status === 'group' ? (
                                    <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1">
                                        <path d="M12 2l10 6.5v7L12 22 2 15.5v-7L12 2zM12 22v-6.5" />
                                        <path d="M22 8.5l-10 7-10-7" />
                                        <path d="M2 15.5l10-7 10 7M12 2v6.5" />
                                    </svg>
                                ) : (
                                    <img src={message.profile} alt="" />
                                )}
                            </div>
                            <div className="msg-detail overflow-hidden">
                                <div className="msg-username font-poppins mb-1 font-semibold text-base">{message.username}</div>
                                <div className="msg-content font-medium text-xs">
                                    <span className="msg-message whitespace-nowrap overflow-hidden overflow-ellipsis text-main-dark-SIDEMESSAGE">{message.message}</span>
                                    <span className="msg-date text-main-dark-MSGDATE text-sm ml-1">{message.date}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* <button className="add"></button>
                    <div className="overlay"></div> */}
                </div>
                <div className="chat-area flex flex-col overflow-scroll flex-1 bg-orange-500">
                    <div className="chat-area-header flex sticky top-0 left-0 z-10 overflow-hidden w-full items-center justify-between p-5 bg-zinc-800">
                        <div className="chat-area-title text-lg font-semibold">PINGPONG Group</div>
                        <div className="chat-area-group">
                            <img className="chat-area-profile" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%283%29+%281%29.png" alt="" />
                            <img className="chat-area-profile" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%282%29.png" alt="" />
                            <img className="chat-area-profile" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%2812%29.png" alt="" />
                            <span className='w-8 h-8 bg-slate-200 rounded-full flex justify-center items-center font-normal text-sm'>+4</span>
                        </div>
                    </div>
                    <div className="chat-area-main">
                        {
                            messages.map((message, index) => (
                                <div className="chat-msg">
                                    <div className="chat-msg-profile">
                                        <img className="chat-msg-img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%283%29+%281%29.png" alt="" />
                                        <div className="chat-msg-date">Message seen 1.22pm</div>
                                    </div>
                                    <div className="chat-msg-content">
                                        {
                                            (message.img! && message.img != '')
                                            ?
                                            <div className="chat-msg-text bg-main-light-FERN text-white">
                                                <img src={message.img} alt="" />
                                            </div>
                                         : 
                                         <div className="chat-msg-text bg-main-light-FERN text-white">{message.message}</div>
                                        }
                                    </div>
                                </div>

                            ))
                        }
                        <div className="chat-msg owner">
                            <div className="chat-msg-profile">
                                <img className="chat-msg-img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%281%29.png" alt="" />
                                <div className="chat-msg-date">Message seen 1.22pm</div>
                            </div>
                            <div className="chat-msg-content">
                                <div className="chat-msg-text bg-main-light-FERN text-white">Sit amet risus nullam eget felis eget. Dolor sed viverra ipsum😂😂😂</div>
                                <div className="chat-msg-text bg-main-light-FERN text-white">Cras mollis nec arcu malesuada tincidunt.</div>
                            </div>
                        </div>
                    </div>
                    <div className="footer flex border-t-2 border-t-white sticky flex-row bottom-0 left-0 items-center w-full overflow-hidden bg-rose-400" style={{ padding: '10px 20px'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="feather feather-video">
                                <path d="M23 7l-7 5 7 5V7z" />
                                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="feather feather-image">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <path d="M21 15l-5-5L5 21" /></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="feather feather-plus-circle">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 8v8M8 12h8" /></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="feather feather-paperclip">
                                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" /></svg>
                            <input type="text" className='h-10' placeholder="Type something here..." />
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="feather feather-smile">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" /></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="feather feather-thumbs-up">
                                <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" /></svg>
                    </div>
                    {/* <div className="chat-area-footer">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="feather feather-video">
                        <path d="M23 7l-7 5 7 5V7z" />
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="feather feather-image">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" /></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="feather feather-plus-circle">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v8M8 12h8" /></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="feather feather-paperclip">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" /></svg>
                        <input type="text" placeholder="Type something here..." />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="feather feather-smile">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" /></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="feather feather-thumbs-up">
                        <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" /></svg>
                    </div> */}
                </div>
                <div className="detail-area">
                    <div className="detail-area-header">
                        <div className="msg-profile group">
                            <img src={latestMessages[1].profile} alt='' />
                        </div>
                        <div className="detail-title">{latestMessages[1].username}</div>
                        <div className="detail-subtitle">Created by Aysenur</div>
                        <div className="detail-buttons">
                            <button className="detail-button">
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" stroke-width="0" stroke-linecap="round" stroke-linejoin="round" className="feather feather-phone">
                                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                                </svg>
                                Call Group
                            </button>
                            <button className="detail-button">
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" stroke-width="0" stroke-linecap="round" stroke-linejoin="round" className="feather feather-video">
                                    <path d="M23 7l-7 5 7 5V7z" />
                                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
                                Video Chat
                            </button>
                        </div>
                    </div>
                    <div className="detail-changes">
                        <input type="text" placeholder="Search in Conversation" />
                        <div className="detail-change">
                            Change Color
                            <div className="colors">
                                <div className="color blue selected" data-color="blue"></div>
                                <div className="color purple" data-color="purple"></div>
                                <div className="color green" data-color="green"></div>
                                <div className="color orange" data-color="orange"></div>
                            </div>
                        </div>
                        <div className="detail-change">
                            Change Emoji
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-thumbs-up">
                                <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" /></svg>
                        </div>
                    </div>
                    <div className="detail-photos">
                        <div className="detail-photo-title">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-image">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <path d="M21 15l-5-5L5 21" /></svg>
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
                    <a href="https://twitter.com/AysnrTrkk" className="follow-me" target="_blank">
                        <span className="follow-text">
                            <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" className="css-i6dzq1">
                                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                            </svg>
                            Follow me on Twitter
                        </span>
                        <span className="developer">
                            <img src="https://pbs.twimg.com/profile_images/1253782473953157124/x56UURmt_400x400.jpg" />
                            Aysenur Turk — @AysnrTrkk
                        </span>
                    </a>
                </div>
            </div>
        </>
    )
}

export default chatComponent;