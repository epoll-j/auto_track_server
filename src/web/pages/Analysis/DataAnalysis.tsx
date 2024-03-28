import React from 'react';
import { Row, Col } from 'antd'
import { PageContainer, ProCard, StatisticCard, Statistic } from '@ant-design/pro-components'
import { getDashboard } from '@/api/controller/functions/analysis';
import { useRequest } from 'ahooks';
import { Line, Column } from '@ant-design/plots';

const topColResponsiveProps = {
    xs: 24,
    sm: 12,
    md: 12,
    lg: 12,
    xl: 8,
    style: {
        marginBottom: 24,
    },
};

export default () => {

    const { data: dashboardData, loading: dashboardLoading } = useRequest(() => getDashboard({ query: { appKey: 'b922ceea' } }));

    const lineConfig = {
        xField: 'dataTime',
        height: 200
    };

    const columnConfig = {
        xField: 'track_type',
        yField: 'num',
        seriesField: 'track_key',
        colorField: 'track_key',
        style: {
        },
    };

    return (
        <>
            <PageContainer loading={dashboardLoading}>
                <Row gutter={24}>
                    <Col {...topColResponsiveProps}>
                        <ProCard>
                            <StatisticCard
                                statistic={{
                                    title: '总用户',
                                    value: dashboardLoading ? '-' : dashboardData.tu,
                                }}
                                chart={
                                    dashboardLoading ? null : <Line {...lineConfig} yField="appTu" data={dashboardData.statistics}></Line>
                                }
                            >
                            </StatisticCard>
                        </ProCard>
                    </Col>
                    <Col {...topColResponsiveProps}>
                        <ProCard>
                            <StatisticCard
                                statistic={{
                                    title: '日活用户',
                                    value: dashboardLoading ? '-' : dashboardData.dau,
                                }}
                                chart={
                                    dashboardLoading ? null : <Line {...lineConfig} yField="appDau" data={dashboardData.statistics}></Line>
                                }
                            >
                            </StatisticCard>
                        </ProCard>
                    </Col>
                    <Col {...topColResponsiveProps}>
                        <ProCard>
                            <StatisticCard
                                statistic={{
                                    title: '新增用户',
                                    value: dashboardLoading ? '-' : dashboardData.nu,
                                }}
                                chart={
                                    dashboardLoading ? null : <Line {...lineConfig} yField="appNu" data={dashboardData.statistics}></Line>
                                }
                            >
                            </StatisticCard>
                        </ProCard>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={24}>
                        <ProCard>
                            {
                                dashboardLoading ? null : <Column {...columnConfig} data={JSON.parse(dashboardData.statistics[0].otherParams).map(item => {
                                    return {
                                        track_type: item.track_type,
                                        track_key: item.track_key,
                                        num: Number(item.num)
                                    }
                                })} />
                            }
                        </ProCard>
                    </Col>
                </Row>
            </PageContainer>
        </>
    );
}