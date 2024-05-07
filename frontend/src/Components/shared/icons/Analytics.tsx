const AnalyticsIcon = ({activeIndex} : {activeIndex: number}) => (
    <div className={`w-[40px] h-[40px] left-0 top-0 relative rounded-full ${activeIndex === 2 ? 'bg-main-light-FERN' : null}`}>
        <div className="flex items-center justify-center w-full h-full">
            <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M18.7 2.41895C18.2049 2.41895 17.7301 2.61561 17.38 2.96568C17.03 3.31575 16.8333 3.79054 16.8333 4.28561V9.41894H11.7C11.2049 9.41894 10.7301 9.61561 10.38 9.96568C10.03 10.3157 9.83331 10.7905 9.83331 11.2856V17.5856H4.69998C4.20491 17.5856 3.73012 17.7823 3.38005 18.1323C3.02998 18.4824 2.83331 18.9572 2.83331 19.4523V23.8856C2.83331 24.3807 3.02998 24.8555 3.38005 25.2055C3.73012 25.5556 4.20491 25.7523 4.69998 25.7523H24.3C24.795 25.7523 25.2698 25.5556 25.6199 25.2055C25.97 24.8555 26.1666 24.3807 26.1666 23.8856V4.28561C26.1666 3.79054 25.97 3.31575 25.6199 2.96568C25.2698 2.61561 24.795 2.41895 24.3 2.41895H18.7ZM12.1666 11.7523H16.8333V23.4189H12.1666V11.7523ZM23.8333 23.4189H19.1666V4.75228H23.8333V23.4189ZM9.83331 19.9189V23.4189H5.16665V19.9189H9.83331Z"
                    className='fill-white'
                />
            </svg>
        </div>
    </div>
  );
export default AnalyticsIcon;