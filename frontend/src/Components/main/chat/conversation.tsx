import { useContext } from "react";
import DataContext from "../../../services/data.context";
import LoadingComponent from "../../shared/loading/loading";
import messageUser from "../../../model/messageUser.model";

function conversationArea(props: messageUser[]) {
    const latestMessages = props;

    // const userData = useContext(DataContext);
    // if (!userData)
    //     return <LoadingComponent />;
  return (
    <>
        {latestMessages.map((message, index) => (
            <div key={index} className={`msg ${message.status}`}>
                <div className="msg-profile rounded-full mr-4 bg-rose-400 ">
                    {message.status === 'group' ? (
                        <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1">
                            <path d="M12 2l10 6.5v7L12 22 2 15.5v-7L12 2zM12 22v-6.5" />
                            <path d="M22 8.5l-10 7-10-7" />
                            <path d="M2 15.5l10-7 10 7M12 2v6.5" />
                        </svg>
                    ) : (
                        <img src={message.profile} className='object-cover bg-contain h-full bg-no-repeat bg-center' alt="" />
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
    </>
  );
}

export default conversationArea;