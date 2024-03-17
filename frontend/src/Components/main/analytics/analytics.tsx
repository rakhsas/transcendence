import Chart from 'chart.js/auto';
import './analytics.css';


function AnalyticsComponent(): JSX.Element {
    return (
        <>
            <div className="container">
                <div className='leader-board'>
                    <div className='top3'>
                        <div className='first-cards' id='one'>
                            <img src="/woumecht.jpg" alt="" />
                            <h3 className='fullName'>Walid oumechtak</h3>
                            <p className='login'>woumecht</p>
                            <button className='btn-profile'>Profile</button>
                            <span className='rank'>1st</span>
                            <div className='score'>Score: 230 exp</div>
                        </div>
                        <div className='first-cards' id='two'>
                            <img src="/rakhsas.jpg" alt="" />
                            <h4 className='fullName'>Walid oumechtak</h4>
                            <p className='login'>woumecht</p>   
                            <button className='btn-profile'>Profile</button>
                            <span className='rank'>2st</span>
                            <div className='score'>Score: 230 exp</div>
                        </div>
                        <div className='first-cards' id='three'>
                            <img src="/hbenfadd.jpg" alt="" />
                            <h3 className='fullName'>Walid oumechtak</h3>
                            <p className='login'>woumecht</p>
                            <button className='btn-profile'>Profile</button>
                            <span className='rank'>3st</span>
                            <div className='score'>Score: 230 exp</div>
                        </div>
                    </div>
                      {/* =========== other player part ================= */}
                    <div className='other-players'>
                        <div className='row-cards'>
                            <p className='rank'>4th</p>
                            <div className="image-wrappear">
                                <img className='profile-img' src="/woumecht.jpg" alt="" />
                            </div>
                            <div className='info'>
                                <h4 className='fullName'>Walid Oumechtak</h4>
                                <p className='login'>woumecht</p>
                            </div>
                            <button className='btn-profile'>profile</button>
                            {/* <div className='score'>
                                <p>Score</p>
                            </div> */}
                            <span className='score'>Score <br />400</span>
                        </div>

                        <div className='row-cards'>
                            <p className='rank'>4th</p>
                            <div className="image-wrappear">
                                <img className='profile-img' src="/woumecht.jpg" alt="" />
                            </div>
                            <div className='info'>
                                <h4 className='fullName'>Walid Oumechtak</h4>
                                <p className='login'>woumecht</p>
                            </div>
                            <button className='btn-profile'>profile</button>
                            {/* <div className='score'>
                                <p>Score</p>
                            </div> */}
                            <span className='score'>Score <br />400</span>
                        </div>

                        <div className='row-cards'>
                            <p className='rank'>4th</p>
                            <div className="image-wrappear">
                                <img className='profile-img' src="/woumecht.jpg" alt="" />
                            </div>
                            <div className='info'>
                                <h4 className='fullName'>Walid Oumechtak</h4>
                                <p className='login'>woumecht</p>
                            </div>
                            <button className='btn-profile'>profile</button>
                            {/* <div className='score'>
                                <p>Score</p>
                            </div> */}
                            <span className='score'>Score <br />400</span>
                        </div>

                        <div className='row-cards'>
                            <p className='rank'>4th</p>
                            <div className="image-wrappear">
                                <img className='profile-img' src="/woumecht.jpg" alt="" />
                            </div>
                            <div className='info'>
                                <h4 className='fullName'>Walid Oumechtak</h4>
                                <p className='login'>woumecht</p>
                            </div>
                            <button className='btn-profile'>profile</button>
                            {/* <div className='score'>
                                <p>Score</p>
                            </div> */}
                            <span className='score'>Score <br />400</span>
                        </div>
                    </div>
                </div>
                {/* ======================== Ends of leader board ============================== */}
                
                <div className='analytics'>
                    <div className="mini-profile">
                        <div className="profile-title">Profile</div>
                        <div className="midle-content">
                            <div className="user-info">
                                <img className='profile-img' src="/woumecht.jpg" alt="" />
                                <div className="info">
                                    <h4 className='fullName'>Walid Oumechtak</h4>
                                    <p className='login'>woumecht</p>
                                </div>
                            </div>
                            <div className="last-achivement">
                                <img src="/achievement.png" alt="achievement" />
                            </div>
                        </div>
                        <div className="bottom-content">
                            <div className="lastGame">Last Game <br /> Win</div>
                            <span className='separator'> - </span>
                            <div className="status">Status <br /> Online</div>
                            <span className='separator'> - </span>
                            <div className="score">Score <br /> 200 pts</div>
                        </div>
                    </div>
                    <div className="statistics"></div>
                </div>
            </div>
        </>
    )
}
export default AnalyticsComponent;