import './Friends.css';
import { useContext } from 'react';
import DataContext from '../../../services/data.context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
// import { Doughnut } from 'react-chartjs-2';
import CreatChartDesign from './Chart'

export default function FrinedsFormUserPage(): JSX.Element {
    const userData = useContext(DataContext);
    // const MyComponent: React.FC<{ className: string }> = ({ className }) => {
    //     const [color] = useState<string>('green');
    //     if (color == "green"){
            
    //     }
    //     return (
    //       <div className={className}>
    //         {/* Other content */}
    //       </div>
    //     );
    //   };
    return (
        <div className='Friends overflow-y-scroll no-scrollbar'>
            <div className='Progress Sel overflow-y-scroll no-scrollbar'>
                <h1 className='text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 sheap1'>
                    Progress
                </h1>
                <div className='op overflow-y-scroll no-scrollbar'>
                    <CreatChartDesign></CreatChartDesign>
                    <CreatChartDesign></CreatChartDesign>
                    {/* <CreatChartDesign></CreatChartDesign> */}
                    {/* <App></App>
                    <App></App> */}
                </div>
            </div>
            <div className="MatcheFin Sel  overflow-y-scroll no-scrollbar" >
                <h1 className='overflow-y-scroll no-scrollbar text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 sheap1'>
                    FiNMatches
                </h1>
                <div className='op overflow-y-scroll no-scrollbar'>
                    <div className='op-child p-4 mt-8 '>
                        <img src={userData.picture} alt="" className='coal1' />
                        <div className='child-ch1 overflow-y-scroll no-scrollbar'>
                            <p className='ch1-p'>1</p>
                            <p className='ch2-p'>2</p>
                        </div>
                        <img src={userData.picture} alt="" className='coal2' />
                    </div>
                    <div className='op-child p-4 mt-4'>
                        <img src={userData.picture} alt="" className='coal1' />
                        <div className='child-ch1 overflow-y-scroll no-scrollbar'>
                            <p className='ch1-p'>5</p>
                            <p className='ch2-p'>3</p>
                        </div>
                        <img src={userData.picture} alt="" className='coal2' />
                    </div>
                    <div className='op-child p-4 mt-4'>
                        <img src={userData.picture} alt="" className='coal1' />
                        <div className='child-ch1 overflow-y-scroll no-scrollbar'>
                            <p className='ch1-p'>4</p>
                            <p className='ch2-p'>5</p>
                        </div>
                        <img src={userData.picture} alt="" className='coal2' />
                    </div>
                    <div className='op-child p-4 mt-4'>
                        <img src={userData.picture} alt="" className='coal1' />
                        <div className='child-ch1 overflow-y-scroll no-scrollbar'>
                            <p className='ch1-p'>0</p>
                            <p className='ch2-p'>5</p>
                        </div>
                        <img src={userData.picture} alt="" className='coal2' />
                    </div>
                    <div className='op-child p-4 mt-4'>
                        <img src={userData.picture} alt="" className='coal1' />
                        <div className='child-ch1 overflow-y-scroll no-scrollbar'>
                            <p className='ch1-p'>3</p>
                            <p className='ch2-p'>5</p>
                        </div>
                        <img src={userData.picture} alt="" className='coal2' />
                    </div>
                    <div className='op-child p-4 mt-4'>
                        <img src={userData.picture} alt="" className='coal1' />
                        <div className='child-ch1 overflow-y-scroll no-scrollbar'>
                            <p className='ch1-p'>2</p>
                            <p className='ch2-p'>5</p>
                        </div>
                        <img src={userData.picture} alt="" className='coal2' />
                    </div>
                    <div className='op-child p-4 mt-4'>
                        <img src={userData.picture} alt="" className='coal1' />
                        <div className='child-ch1 overflow-y-scroll no-scrollbar'>
                            <p className='ch1-p'>5</p>
                            <p className='ch2-p'>1</p>
                        </div>
                        <img src={userData.picture} alt="" className='coal2' />
                    </div>
                    <div className='op-child p-4 mt-4'>
                        <img src={userData.picture} alt="" className='coal1' />
                        <div className='child-ch1 overflow-y-scroll no-scrollbar'>
                            <p className='ch1-p'>4</p>
                            <p className='ch2-p'>5</p>
                        </div>
                        <img src={userData.picture} alt="" className='coal2' />
                    </div>
                    <div className='op-child p-4 mt-4'>
                        <img src={userData.picture} alt="" className='coal1' />
                        <div className='child-ch1 overflow-y-scroll no-scrollbar'>
                            <p className='ch1-p'>5</p>
                            <p className='ch2-p'>4</p>
                        </div>
                        <img src={userData.picture} alt="" className='coal2' />
                    </div>
                    <div className='op-child p-4 mt-4'>
                        <img src={userData.picture} alt="" className='coal1' />
                        <div className='child-ch1 overflow-y-scroll no-scrollbar'>
                            <p className='ch1-p'>5</p>
                            <p className='ch2-p'>3</p>
                        </div>
                        <img src={userData.picture} alt="" className='coal2' />
                    </div>
                </div>
            </div>
            <div className="cheve Sel">
                <h1 className='text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 sheap1 overflow-y-scroll no-scrollbar'>
                    Achievements
                </h1>
                <div className='op overflow-y-scroll no-scrollbar' >
                    <div className='op-child he-child p-4 mt-8'>
                        <FontAwesomeIcon icon={faCheckCircle} className='verify' style={{color: `${userData.coalitionColor}`}} />
                        <p className='Achevdecor overflow-y-scroll no-scrollbar'>Play The First Game</p>
                    </div>
                    <div className='op-child he-child p-4 mt-4'>
                        <FontAwesomeIcon icon={faCheckCircle} className='verify' style={{color: `${userData.coalitionColor}`}} />
                        <p className='Achevdecor overflow-y-scroll no-scrollbar'>You win The First Game</p>
                    </div>
                    <div className='op-child he-child p-4 mt-4'>
                        <FontAwesomeIcon icon={faCheckCircle} className='verify' style={{color: `${userData.coalitionColor}`}} />
                        <p className='Achevdecor overflow-y-scroll no-scrollbar'>You win The Maximum Score</p>
                    </div>
                    <div className='op-child he-child p-4 mt-4'>
                        <FontAwesomeIcon icon={faCheckCircle} className='verify' style={{color: `${userData.coalitionColor}`}} />
                        <p className='Achevdecor overflow-y-scroll no-scrollbar'>You win The First 5 Games</p>
                    </div>
                    <div className='op-child he-child p-4 mt-4'>
                        <FontAwesomeIcon icon={faCheckCircle} className='verify' style={{color: `${userData.coalitionColor}`}} />
                        <p className='Achevdecor overflow-y-scroll no-scrollbar'>You Play vs Your Friend</p>
                    </div>
                    <div className='op-child he-child p-4 mt-4'>
                        <FontAwesomeIcon icon={faCheckCircle}  className='verify' style={{color: `${userData.coalitionColor}`}} />
                        <p className='Achevdecor overflow-y-scroll no-scrollbar'>You Acheived The level 1</p>
                    </div>
                    <div className='op-child he-child p-4 mt-4'>
                        <FontAwesomeIcon icon={faCheckCircle} className='verify' style={{color: `${userData.coalitionColor}`}}/>
                        <p className='Achevdecor overflow-y-scroll no-scrollbar'>You Acheived The level 10</p>
                    </div>
                    <div className='op-child he-child p-4 mt-4'>
                        <FontAwesomeIcon icon={faCheckCircle} className='verify' style={{color: `${userData.coalitionColor}`}} />
                        <p className='Achevdecor overflow-y-scroll no-scrollbar'>You Acheived The level 100</p>
                    </div>
                    <div className='op-child he-child p-4 mt-4'>
                        <FontAwesomeIcon icon={faCheckCircle} className='verify' style={{color: `${userData.coalitionColor}`}} />
                        <p className='Achevdecor overflow-y-scroll no-scrollbar'>You win The First 10 Games</p>
                    </div>
                    <div className='op-child he-child p-4 mt-4'>
                        <FontAwesomeIcon className='verify'  icon={faCheckCircle} style={{color: `${userData.coalitionColor}`}} />
                        <p className='Achevdecor overflow-y-scroll no-scrollbar'>You win The First 100 Games</p>
                    </div>
                </div>
            </div>
            <div className="ColorSwitch">
                <span className='active'  style={{backgroundColor: 'green'}}></span>
                <span style={{backgroundColor: 'red'}}></span>
                <span style={{backgroundColor: 'blue'}}></span>
            </div>
        </div>
    );
}

/*<FontAwesomeIcon icon={faCheckCircle} style={{color: `green`}}/> */