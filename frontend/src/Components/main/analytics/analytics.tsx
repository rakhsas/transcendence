// import Chart from 'chart.js/auto';
import { Bar, Line } from 'react-chartjs-2';
import './analytics.css';
import { useContext, useEffect, useState } from 'react';
import User from '../../../model/user.model';
import { Link } from 'react-router-dom';
import DataContext from '../../../services/data.context';
import LoadingComponent from '../../shared/loading/loading';
import { GameService } from '../../../services/game.service';
import { AnalyticsService } from '../../../services/analytics.service';

function AnalyticsComponent(): JSX.Element {
    const userData = useContext(DataContext);

    const [top3, setTop3] = useState<User[]>([]);
    const [other_players, setOtherPlayers] = useState<User[]>([]);
    const [ikhan, setIkhan] = useState<any>(null);
    const [lastSevenDays, setLastSevenDay] = useState<[]> ([]);
    const gameService = new GameService();
    const analyticsService = new AnalyticsService();
    useEffect(() => {

        const fetchTop3 = async () => {
            const result = await analyticsService.fetchTop3();
            setTop3(result);
        }

        const otherPlayer = async () => {
            const result = await analyticsService.otherPlayers();
            if (result.length > 3)
                result.splice(0, 3);
            setOtherPlayers(result);
            // setOtherPlayers([]);
        }

        

        fetchTop3();
        otherPlayer();
    }, []);



    const currentDate = new Date();
    const labels = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString()); // Format the date as desired
    }

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Games Played',
                data: lastSevenDays,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    };


    useEffect(() => {
        if (!userData)
            return ;
        const fetchLastGame = async () => {
            const result = await gameService.getLastGame(userData[0].id);
            // console.log("the ressult is : ", result);
            setIkhan(result)
            const result1 = await analyticsService.lastSevenDays(userData[0].id);
            setLastSevenDay(result1);
        }

        // fetchSevenDays()
        fetchLastGame()
    }, [userData])
    if (!userData)
        return <LoadingComponent />
    // console.log("top3: ", top3);
    return (
        <>
            <div className="container-analytics font-poppins overflow-x-hidden">
                <div className='leader-board'>
                    <div className='top3'>
                        {top3.length === 0 ? (
                                <div className='dark:bg-black bg-white p-9 w-full'>
                                    <p>No users available</p>
                                </div>
                            ) : (
                            top3.map((user, index) => (
                                <div className='dark:bg-black bg-white first-cards' id='one' key={index}>
                                    <img src={user.picture} alt="" />
                                    <h3 className='dark:text-white text-black fullName font-poppins '>{user.firstName} {user.lastName}</h3>
                                    <p className='login font-poppins'>{user.username}</p>
                                    {/* <Link to="https://10.11.42.174/dashboard/"> */}
                                    <Link className='btn-profile font-poppins' to={`https://10.11.42.174/dashboard/profile/${user.id}`}>
                                        Profile
                                    </Link>

                                    {/* <button className='btn-profile font-poppins'>Profile</button> */}
                                    <span className='dark:text-white!important rank font-poppins'>{index + 1}</span>
                                    <div className='dark:text-white text-black score font-poppins'>Score: {user.score} Pts</div>
                                </div>
                            ))
                        )}
                    </div>
                    {/* =========== other player part ================= */}
                    <div className='other-players'>

                        {other_players.length === 0 ? (
                                <div className='dark:bg-black bg-white p-9 w-full'>
                                    <p>No users available</p>
                                </div>
                            ) : (
                            other_players.map((_user, index) => (
                                <div className='bg-white row-cards dark:bg-black' key={index}>
                                    <p className='rank text-black dark:text-white font-poppins'>{index + 4}</p>
                                    <div className="image-wrappear">
                                        <img className='profile-img' src={_user.picture} alt="" />
                                    </div>
                                    <div className='info absolute left-1/4'>
                                        <h4 className='text-black dark:text-white fullName font-poppins'>{_user.firstName} {_user.lastName}</h4>
                                        <p className='text-black dark:text-white login font-poppins'>{_user.username}</p>
                                    </div>
                                    {/* <button className='btn-profile font-poppins'>profile</button> */}
                                    <Link className='btn-profile font-poppins' to={`https://10.11.42.174/dashboard/profile/${_user.id}`}>
                                        Profile
                                    </Link>
                                    <span className='text-black dark:text-white score font-poppins'>Score <br />{_user.score}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                {/* ======================== Ends of leader board ============================== */}

                <div className='analytics'>
                    <div className="mini-profile bg-white dark:bg-black">
                        <div className="profile-title text-black dark:text-white font-poppins">Profile</div>
                        <div className="midle-content">
                            <div className="user-info">
                                <img className='profile-img' src={userData[0].picture} alt="" />
                                <div className="info">
                                    <h4 className='fullName text-black dark:text-white font-poppins'>{userData[0].firstName} {userData[0].lastName}</h4>
                                    <p className='login text-black dark:text-white font-poppins'>{userData[0].username}</p>
                                </div>
                            </div>
                            <div className="last-achivement">
                                <img src="/achievement.png" alt="achievement" />
                            </div>
                        </div>
                        <div className="bottom-content">
                            <div className="lastGame text-black dark:text-white font-poppins">Last Game <br />{ikhan !== null && ikhan[0].user_score > ikhan[0].player_score ? 'Won' : 'Lose'}</div>
                            <span className='separator font-poppins'></span>
                            <div className="status text-black dark:text-white font-poppins">Status <br /> Online</div>
                            <span className='separator font-poppins'></span>
                            <div className="score text-black dark:text-white font-poppins">Score <br /> {userData[0].score} pts</div>
                        </div>
                    </div>
                    <div className="statistics bg-white dark:bg-black">
                        <Line data={data} />
                        {/* <Line
                            data={{
                                labels: ["Day 1", "Day2", "Day 3"],
                                datasets: [{
                                    label: "games played in each Day",
                                    data: [5, 3, 7],
                                    fill: false,
                                    borderColor: 'rgb(75, 192, 192)',
                                    tension: 0.1,
                                    backgroundColor: '#3DBDA7',
                                }]
                            }} /> */}
                    </div>
                </div>
            </div>
        </>
    )
}
export default AnalyticsComponent;