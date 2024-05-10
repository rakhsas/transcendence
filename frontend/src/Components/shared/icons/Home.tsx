const HomeIcon = ({ activeIndex }: { activeIndex: number }) => {
    return (
        <div className={`w-[40px] h-[40px] left-0 top-0 relative rounded-full ${activeIndex === 0 ? 'bg-main-light-FERN' : null}`}>
            <div className="flex items-center justify-center w-full h-full">
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.9163 20.8333V12.6812C22.9164 12.114 22.8007 11.5528 22.5762 11.032C22.3518 10.5111 22.0234 10.0415 21.6111 9.65202L13.9309 2.39368C13.5441 2.02798 13.032 1.82422 12.4997 1.82422C11.9674 1.82422 11.4552 2.02798 11.0684 2.39368L3.38822 9.65202C2.97595 10.0415 2.64754 10.5111 2.42311 11.032C2.19868 11.5528 2.08295 12.114 2.08301 12.6812V20.8333C2.08301 21.3858 2.3025 21.9157 2.6932 22.3064C3.0839 22.6971 3.61381 22.9166 4.16634 22.9166H20.833C21.3855 22.9166 21.9154 22.6971 22.3061 22.3064C22.6968 21.9157 22.9163 21.3858 22.9163 20.8333Z" stroke="white" strokeWidth="2.17" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
        </div>
    );
};

export default HomeIcon;
