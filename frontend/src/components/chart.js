import { PieChart } from 'react-minimal-pie-chart';
// const data=[
//     {
//     title: 10,
//     color: "#E38627",
//     value: 10,
//     },
//     {
//     title: 15,
//     color: "#C13C37",
//     value: 15,
//     },
//     {
//     title: 20,
//     color: "#6A2135",
//     value: 20,
//     },
//   ]
const Chart=(props)=>{
    return(
        <PieChart
              style={{margin:'0px',padding:'0px',border:'0px',width:'200px',height:'200px'}}
              animate
              animationDuration={500}
              animationEasing="ease-out"
              data={props.data}
              paddingAngle={0}
              startAngle={270}
              label={(data) => data.dataEntry.title}
              labelPosition={65}
              labelStyle={{
                fontSize: "10px",
                fontColor: "FFFFFA",
                fontWeight: "800",
              }}
        />
    )
}
export default Chart;
