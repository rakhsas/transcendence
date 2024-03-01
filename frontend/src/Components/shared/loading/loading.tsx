import './loading.css';

function LoadingComponent(): JSX.Element {
    return (
        <>
            <div className="h-fill w-full flex flex-row justify-center items-center">
                <div className="loader">
                    <div className="loader-square dark:bg-main-light-CLOUDWISP bg-zinc-900"></div>
                    <div className="loader-square dark:bg-main-light-CLOUDWISP bg-zinc-900"></div>
                    <div className="loader-square dark:bg-main-light-CLOUDWISP bg-zinc-900"></div>
                    <div className="loader-square dark:bg-main-light-CLOUDWISP bg-zinc-900"></div>
                    <div className="loader-square dark:bg-main-light-CLOUDWISP bg-zinc-900"></div>
                    <div className="loader-square dark:bg-main-light-CLOUDWISP bg-zinc-900"></div>
                    <div className="loader-square dark:bg-main-light-CLOUDWISP bg-zinc-900"></div>
                </div>
            </div>
        </>
    );
}
export default LoadingComponent;