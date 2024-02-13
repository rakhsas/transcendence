import './loading.css';

function LoadingComponent(): JSX.Element {
    return (
        <>
            <div className="h-fill w-full flex flex-row justify-center items-center">
            <div className="loader">
                <div className="loader-square"></div>
                <div className="loader-square"></div>
                <div className="loader-square"></div>
                <div className="loader-square"></div>
                <div className="loader-square"></div>
                <div className="loader-square"></div>
                <div className="loader-square"></div>
            </div>
            </div>
        </>
    );
}
export default LoadingComponent;