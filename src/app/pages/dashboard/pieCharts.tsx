import Stack from '@mui/material/Stack'
import { PieChart } from '@mui/x-charts/PieChart'

const data = [
    { label: 'Group A', value: 400 },
    { label: 'Group B', value: 300 },
    { label: 'Group C', value: 300 },
    { label: 'Group D', value: 200 }
]

export default function PieChartWithPaddingAngle(prop: any) {
    const { insurerCount } = prop
    return (

        <PieChart
            series={[
                {
                    //arcLabel: (item) => `${item.label} (${item.value})`,
                    // startAngle: -90,
                    // endAngle: 90,
                    // paddingAngle: 5,
                    // innerRadius: 60,
                    // outerRadius: 80,
                    data: insurerCount
                }
            ]}
            margin={{ right: 0 }}
            width={400}
            height={200}
            slotProps={{
                legend: { hidden: true }
            }}
        />

    )
}
