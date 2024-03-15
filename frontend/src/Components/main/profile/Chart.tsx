import { useContext } from 'react';
import {
    Chart as Chartjs,
    ArcElement,Tooltip,
    Legend
} from 'chart.js'


import { Doughnut } from 'react-chartjs-2';
import DataContext from '../../../services/data.context';
// import LoadingComponent from '../../shared/loading/loading';


Chartjs.register(
    ArcElement,
    Tooltip,
    Legend
);


export default function CreatChartDesign() {
    const userData = useContext(DataContext);
    console.log(userData?.coalitionColor || '');
    // if (!userData)
    //     return (<LoadingComponent/>);
    // const gp:string = 'GamesPlay 15'; 
    const data = {
        labels: ['GamesPlay ', 'TotlaGames : 100'],
        datasets: [{
            label: '',
            data: [15, 100],
            backgroundColor: ['#059669', userData?.coalitionColor || ''],

        }]
    }
    const options ={

    }
    return (
        <div className='appChart overflow-y-scroll no-scrollbar'>
            {/* <h1 style={{padding: '120px'}}> How To Creat ChartJs</h1> */}
            <div style={{width: '250px', height: 'auto', left: '250px', display: 'flex', marginTop: '', flexDirection: 'row'}}>
                <Doughnut
                    data={data}
                    options={options}
                >
                </Doughnut>
            </div>
        </div>
    )
}