import { useContext } from 'react';
import {
    Chart as Chartjs,
    ArcElement,Tooltip,
    Legend
} from 'chart.js'



import { Doughnut } from 'react-chartjs-2';
import DataContext from '../../../services/data.context';
import User from '../../../model/user.model';
import { totalGames } from '../../../utils/types';


Chartjs.register(
    ArcElement,
    Tooltip,
    Legend
);

interface gameProps {
    user: User,
    totalGames: totalGames
}

const CreatChartDesign: React.FC<gameProps> = ({ user, totalGames }) => {
    
    const data = {
        labels: [ `Played Games`, 'Win Games'],
        datasets: [{
            label: '',
            data: [totalGames?.gamePlayed, totalGames?.gameWon],
            backgroundColor: ['#059669', user?.coalitionColor || ''],
            fontWeight: 'bold'
        }],
    }
    const options ={
        plugins: {
            legend: {
                display: false
            }
        }
    }
    return (
        <div className='appChart  no-scrollbar'>
            <div className="w-full">
                <Doughnut
                    data={data}
                    options={options}
                >
                </Doughnut>
            </div>
        </div>
    )
}
export default CreatChartDesign;