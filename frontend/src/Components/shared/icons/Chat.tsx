const ChatIcon = ({ activeIndex }: { activeIndex: number }) => (
    <div className={`w-[40px] h-[40px] left-0 top-0 relative rounded-full ${activeIndex === 3 ? 'bg-main-light-FERN' : null}`}>
        <div className="flex items-center justify-center w-full h-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="29" height="29">
                <path d="M 24 3.9980469 C 12.972292 3.9980469 4 12.970339 4 23.998047 C 4 27.273363 4.8627078 30.334853 6.2617188 33.064453 L 4.09375 40.826172 C 3.5887973 42.629575 5.3719261 44.41261 7.1757812 43.908203 L 14.943359 41.740234 C 17.670736 43.136312 20.727751 43.998047 24 43.998047 C 35.027708 43.998047 44 35.025755 44 23.998047 C 44 12.970339 35.027708 3.9980469 24 3.9980469 z M 24 6.9980469 C 33.406292 6.9980469 41 14.591755 41 23.998047 C 41 33.404339 33.406292 40.998047 24 40.998047 C 20.998416 40.998047 18.190601 40.217527 15.742188 38.853516 A 1.50015 1.50015 0 0 0 14.609375 38.71875 L 7.2226562 40.779297 L 9.2851562 33.396484 A 1.50015 1.50015 0 0 0 9.1503906 32.261719 C 7.7836522 29.811523 7 27.002565 7 23.998047 C 7 14.591755 14.593708 6.9980469 24 6.9980469 z M 15.5 18.998047 A 1.50015 1.50015 0 1 0 15.5 21.998047 L 32.5 21.998047 A 1.50015 1.50015 0 1 0 32.5 18.998047 L 15.5 18.998047 z M 15.5 25.998047 A 1.50015 1.50015 0 1 0 15.5 28.998047 L 28.5 28.998047 A 1.50015 1.50015 0 1 0 28.5 25.998047 L 15.5 25.998047 z"
                    strokeWidth="1" // Increase the stroke width here
                    className='fill-black dark:fill-white stroke-black dark:stroke-white'
                />
            </svg>

        </div>
    </div>
);
export default ChatIcon;