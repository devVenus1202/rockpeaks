import * as React from 'react';

import {
  BarChart,
  Bar,
  Brush,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const data = [
  { name: '1', clips: 300 },
  { name: '2', clips: -145 },
  { name: '3', clips: -100 },
  { name: '4', clips: -8 },
  { name: '5', clips: 100 },
  { name: '6', clips: 9 },
  { name: '7', clips: 53 },
  { name: '8', clips: 252 },
  { name: '9', clips: 79 },
  { name: '10', clips: 294 },
  { name: '12', clips: 43 },
  { name: '13', clips: -74 },
  { name: '14', clips: -71 },
  { name: '15', clips: -117 },
  { name: '16', clips: -186 },
  { name: '17', clips: -16 },
  { name: '18', clips: -125 },
  { name: '19', clips: 222 },
  { name: '20', clips: 372 },
  { name: '21', clips: 182 },
  { name: '22', clips: 164 },
  { name: '23', clips: 316 },
  { name: '24', clips: 131 },
  { name: '25', clips: 291 },
  { name: '26', clips: -47 },
  { name: '27', clips: -415 },
  { name: '28', clips: -182 },
  { name: '29', clips: -93 },
  { name: '30', clips: -99 },
  { name: '31', clips: -52 },
  { name: '32', clips: 154 },
  { name: '33', clips: 205 },
  { name: '34', clips: 70 },
  { name: '35', clips: -25 },
  { name: '36', clips: -59 },
  { name: '37', clips: -63 },
  { name: '38', clips: -91 },
  { name: '39', clips: -66 },
  { name: '40', clips: -50 },
];

class VitalsBarChart extends React.Component {
  render() {
    return (
      <BarChart
        width={600}
        height={300}
        data={data}
        margin={{ top: 150, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <ReferenceLine y={0} stroke="#0088FE" />
        <Bar dataKey="clips" fill="#ff4480" />
      </BarChart>
    );
  }
}

export default VitalsBarChart;
