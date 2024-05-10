const ChatIcon = ({ activeIndex }: { activeIndex: number }) => (
    <div className={`w-[40px] h-[40px] left-0 top-0 relative rounded-full ${activeIndex === 3 ? 'bg-main-light-FERN' : null}`}>
        <div className="flex items-center justify-center w-full h-full">
            <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.542 24.7707H8.45866C4.83366 24.7707 2.41699 22.9582 2.41699 18.729V10.2707C2.41699 6.0415 4.83366 4.229 8.45866 4.229H20.542C24.167 4.229 26.5837 6.0415 26.5837 10.2707V18.729C26.5837 22.9582 24.167 24.7707 20.542 24.7707Z" stroke="#F4F5F6" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.5413 10.875L16.7593 13.8958C15.5147 14.8867 13.4726 14.8867 12.228 13.8958L8.45801 10.875" stroke="#F4F5F6" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    </div>
);
export default ChatIcon;