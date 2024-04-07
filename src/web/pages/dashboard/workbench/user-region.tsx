import Chart from '@/web/components/chart/chart';
import useChart from '@/web/components/chart/useChart';
import { Card } from 'antd';

type Props = {
    series: number[];
    categories: string[];
};

export default function UserRegion({ series, categories }: Props) {
    const chartOptions = useChart({
        stroke: { show: false },
        plotOptions: {
            bar: { horizontal: true, barHeight: '30%' },
        },
        xaxis: {
            categories
        },
    });

    return <Card title="用户地域分布">
        <Chart type="bar" series={[{ data: series }]} options={chartOptions} height={320} />
    </Card>;
}
