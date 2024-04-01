import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import './analytics.css';


function AnalyticsComponent(): JSX.Element {
    return (
        <>
            <div className="container-analytics font-poppins">
                <div className='leader-board'>
                    <div className='top3'>
                        <div className='dark:bg-black bg-white first-cards' id='one'>
                            <img src="/woumecht.jpg" alt="" />
                            <h3 className='dark:text-white text-black fullName font-poppins '>Walid oumechtak</h3>
                            <p className='login font-poppins'>woumecht</p>
                            <button className='btn-profile font-poppins'>Profile</button>
                            <span className='dark:text-white!important rank font-poppins'>1st</span>
                            <div className='dark:text-white text-black score font-poppins'>Score: 230 exp</div>
                        </div>
                        <div className='dark:bg-black first-cards' id='two'>
                            <img src="/rakhsas.jpg" alt="" />
                            <h4 className='fullName font-poppins'>Walid oumechtak</h4>
                            <p className='login font-poppins'>woumecht</p>   
                            <button className='btn-profile font-poppins'>Profile</button>
                            <span className='rank'>2st</span>  
                            <div className='score font-poppins'>Score: 230 exp</div>
                        </div>
                        <div className='dark:bg-black first-cards' id='three'>
                            <img src="/hbenfadd.jpg" alt="" />
                            <h3 className='fullName font-poppins'>Walid oumechtak</h3>
                            <p className='login font-poppins'>woumecht</p>
                            <button className='btn-profile font-poppins'>Profile</button>
                            <span className='rank font-poppins'>3st</span>
                            <div className='score font-poppins'>Score: 230 exp</div>
                        </div>
                    </div>
                      {/* =========== other player part ================= */}
                    <div className='other-players'>
                        <div className='bg-white row-cards dark:bg-black'>
                            <p className='rank text-black dark:text-white font-poppins'>4th</p>
                            <div className="image-wrappear">
                                <img className='profile-img' src="/woumecht.jpg" alt="" />
                            </div>
                            <div className='info'>
                                <h4 className='text-black dark:text-white fullName font-poppins'>Walid Oumechtak</h4>
                                <p className='text-black dark:text-white login font-poppins'>woumecht</p>
                            </div>
                            <button className='btn-profile font-poppins'>profile</button>
                            {/* <div className='score'>
                                <p>Score</p>
                            </div> */}
                            <span className='text-black dark:text-white score font-poppins'>Score <br />400</span>
                        </div>

                        <div className='row-cards'>
                            <p className='rank font-poppins'>4th</p>
                            <div className="image-wrappear">
                                <img className='profile-img' src="/woumecht.jpg" alt="" />
                            </div>
                            <div className='info'>
                                <h4 className='fullName font-poppins'>Walid Oumechtak</h4>
                                <p className='login font-poppins'>woumecht</p>
                            </div>
                            <button className='btn-profile font-poppins'>profile</button>
                            {/* <div className='score'>
                                <p>Score</p>
                            </div> */}
                            <span className='score font-poppins'>Score <br />400</span>
                        </div>

                        <div className='row-cards'>
                            <p className='rank font-poppins'>4th</p>
                            <div className="image-wrappear">
                                <img className='profile-img' src="/woumecht.jpg" alt="" />
                            </div>
                            <div className='info'>
                                <h4 className='fullName font-poppins'>Walid Oumechtak</h4>
                                <p className='login font-poppins'>woumecht</p>
                            </div>
                            <button className='btn-profile font-poppins'>profile</button>
                            {/* <div className='score'>
                                <p>Score</p>
                            </div> */}
                            <span className='score font-poppins'>Score <br />400</span>
                        </div>

                        <div className='row-cards'>
                            <p className='rank font-poppins'>4th</p>
                            <div className="image-wrappear">
                                <img className='profile-img' src="/woumecht.jpg" alt="" />
                            </div>
                            <div className='info'>
                                <h4 className='fullName font-poppins'>Walid Oumechtak</h4>
                                <p className='login font-poppins'>woumecht</p>
                            </div>
                            <button className='btn-profile font-poppins'>profile</button>
                            {/* <div className='score'>
                                <p>Score</p>
                            </div> */}
                            <span className='score font-poppins'>Score <br />400</span>
                        </div>

                       


                        
                    </div>
                </div>
                {/* ======================== Ends of leader board ============================== */}
                
                <div className='analytics'>
                    <div className="mini-profile bg-white dark:bg-black">
                        <div className="profile-title text-black dark:text-white font-poppins">Profile</div>
                        <div className="midle-content">
                            <div className="user-info">
                                <img className='profile-img' src="/woumecht.jpg" alt="" />
                                <div className="info">
                                    <h4 className='fullName text-black dark:text-white font-poppins'>Walid Oumechtak</h4>
                                    <p className='login text-black dark:text-white font-poppins'>woumecht</p>
                                </div>
                            </div>
                            <div className="last-achivement">
                                <img src="/achievement.png" alt="achievement" />
                            </div>
                        </div>
                        <div className="bottom-content">
                            <div className="lastGame text-black dark:text-white font-poppins">Last Game <br /> Win</div>
                            <span className='separator font-poppins'></span>
                            <div className="status text-black dark:text-white font-poppins">Status <br /> Online</div>
                            <span className='separator font-poppins'></span>
                            <div className="score text-black dark:text-white font-poppins">Score <br /> 200 pts</div>
                        </div>
                    </div>
                    <div className="statistics bh-white dark:bg-black">
                        <Bar 
                            data={{
                                labels: ["Day 1", "Day2", "Day 3"],
                                datasets: [{
                                    label: "games played in each Day",
                                    data: [5, 3, 7],
                                    backgroundColor: '#3DBDA7',
                                }]
                            }}/>
                    </div>
                </div>
            </div>
        </>
    )
}
export default AnalyticsComponent;