import {
    Button,
    Card,
    Col,
    Form,
    Row,
    DatePicker,
    Space,
    Select,
} from 'antd';
import { useEffect, useState } from 'react';
import { usePagination, useRequest } from 'ahooks';
import { getFunnelData } from '@/api/controller/functions/analysis';
import Chart from '@/web/components/chart/chart';
import useChart from '@/web/components/chart/useChart';

type SearchType = {
    events: string[];
    time: [Date, Date];
};
const { RangePicker } = DatePicker;

export default function UserAnalysisPage() {
    const { data, loading, run } = useRequest((formVals) => getFunnelData({
        query: {
            appKey: 'b922ceea',
            ...formVals
        }
    }), { manual: true })
    const [searchForm] = Form.useForm();
    const [submittable, setSubmittable] = useState<boolean>(false);
    const values = Form.useWatch([], searchForm)
    useEffect(() => {
        searchForm.validateFields({ validateOnly: true }).then(() => {
            setSubmittable(true);
        }).catch(() => {
            setSubmittable(false);
        })
    }, [searchForm, values])

    const onSearchFormReset = () => {
        searchForm.resetFields();
    };

    const onFinish = (values: SearchType) => {
        run({ events: values.events.join(','), time: values.time.map(item => item.toJSON()) })
    };

    const chartOptions = useChart({
        chart: {
            type: 'bar',
            height: 350,
        },
        plotOptions: {
            bar: {
                borderRadius: 0,
                horizontal: true,
                barHeight: '80%',
                isFunnel: true,
            },
        },
        dataLabels: {
            enabled: true,
            formatter: function (val, opt) {
                return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val + `（${data.conversionRates[opt.dataPointIndex]}）`
            },
            dropShadow: {
                enabled: true,
            },
        },
        xaxis: {
            categories: Object.keys((data || {}).funnelTotals || {}),
        },
        legend: {
            show: false,
        }
    });

    return (
        <Space direction="vertical" size="large" className="w-full">
            <Card>
                <Form form={searchForm} onFinish={onFinish}>
                    <Row gutter={[16, 16]}>
                        <Col span={24} lg={20}>
                            <Row>
                                <Form.Item<SearchType> rules={[{ required: true }]} name="events" className="!mb-0 !mr-1 w-[400px]">
                                    <Select
                                        mode="tags"
                                        style={{ width: '100%' }}
                                        placeholder="Event List"
                                    />
                                </Form.Item>
                                <Form.Item<SearchType> rules={[{ required: true }]} name="time" className="!mb-0">
                                    <RangePicker showTime />
                                </Form.Item>
                            </Row>
                        </Col>
                        <Col span={24} lg={4}>
                            <div className="flex justify-end">
                                <Button onClick={onSearchFormReset}>Reset</Button>
                                <Button disabled={!submittable} type="primary" className="ml-4" htmlType="submit">
                                    Search
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Card>
            <Card loading={loading}>
                <Chart type="bar" series={[{ data: Object.values((data || {}).funnelTotals || {}) as number[] }]} options={chartOptions} />
            </Card>
        </Space>
    );
}