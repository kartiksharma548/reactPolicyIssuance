import { BarChart } from '@mui/x-charts/BarChart'
import { useMediaQuery } from '@mui/material'

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490]
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300]
const xLabels = [
    'Page A',
    'Page B',
    'Page C',
    'Page D',
    'Page E',
    'Page F',
    'Page G'
]

export default function BarChartComponent(props: any) {
    const isDesktop = useMediaQuery("(min-width: 1024px)");
    const isTablet = useMediaQuery("(min-width: 768px)");
    // const isMobile = useMediaQuery("(max-width: 767px)");

    const chartWidth = isDesktop ? 400 : isTablet ? 600 : 300; // Adjust sizes as needed

    return (
        <BarChart
            // width={screenOne ? 450 : screenTwo ? 350 : screenThree ? 300 : 400}
            // height={screenOne ? 250 : screenTwo ? 300 : screenThree ? 450 : 300}
            // series={[
            //     { data: pData, label: 'pv', id: 'pvId' },
            //     { data: uData, label: 'uv', id: 'uvId' }
            // ]}
            // xAxis={[{ data: xLabels, scaleType: 'band' }]}
            {...props}
            width={chartWidth}
            height={300}
            margin={{ left: 70, }} // Adjust margins for centering
            layout="vertical" // Use for better spacing

        />
    )
}
