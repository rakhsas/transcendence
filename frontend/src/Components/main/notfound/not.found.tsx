import './not.found.css';
export function NotFoundComponent() {
    return (
        // <section className="page_404">
            // <div className="container">
                <div className="row rounded-3xl overflow-hidden flex flex-col h-fit bg-white">
                    {/* <div className="col-sm-12 overflow-hidden"> */}
                        {/* <div className="col-sm-10 col-sm-offset-1  text-center p-2"> */}
                            <div className="four_zero_four_bg">
                                <h1 className="text-center text-black font-poppins">404</h1>


                            </div>

                            <div className="px-2">

                                <p className='text-black font-poppins text-2xl'>the page you are looking for not avaible!</p>

                                {/* <a  className="link_404">Go to Home</a> */}
                            </div>
                        {/* </div> */}
                    {/* </div> */}
                </div>
            // </div>
        // </section>
    )
}