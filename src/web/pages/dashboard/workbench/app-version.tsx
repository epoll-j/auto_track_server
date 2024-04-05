import { Typography } from 'antd';

import Card from '@/web/components/card';
import Chart from '@/web/components/chart/chart';
import useChart from '@/web/components/chart/useChart';

type Props = {
  charData: any[];
};
export default function AppVersion({ charData }: Props) {
  return (
    <Card className="flex-col">
      <header className="self-start">
        <Typography.Title level={5}>App版本分布</Typography.Title>
      </header>
      <main>
        <ChartDonut charData={charData} />
      </main>
    </Card>
  );
}

// const series = [44, 55, 13, 43];
function ChartDonut({ charData }: Props) {
  const chartOptions = useChart({
    labels: charData.map((item) => item.appVersion || '未知'),
    stroke: {
      show: false,
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
    },
    tooltip: {
      fillSeriesColor: false,
    },
    chart: {
      width: 240,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '90%',
          labels: {
            total: {
              fontSize: '12px',
            },
            value: {
              fontSize: '18px',
              fontWeight: 700,
            },
          },
        },
      },
    },
  });

  return <Chart type="donut" series={charData.map((item) => Number(item.count))} options={chartOptions} height={360} />;
}