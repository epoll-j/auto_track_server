import { Col, Row } from 'antd';

import AppVersion from './app-version';
import TrackList from './track-list';
import TotalCard from './total-card';
import UserRegion from './user-region';
import { getUserOverview, getUserAppVersionOverview, getUserRegionOverview } from '@/api/controller/functions/analysis';
import { useRequest } from 'ahooks';
import { Skeleton } from 'antd';

function Workbench() {

  const { data: userOverviewData, loading: userOverviewLoading } = useRequest(() => getUserOverview({ query: { appKey: 'b922ceea' } }))
  const { data: versionOverviewData, loading: versionOverviewLoading } = useRequest(() => getUserAppVersionOverview({ query: { appKey: 'b922ceea' } }))
  const { data: regionOverviewData, loading: regionOverviewLoading } = useRequest(() => getUserRegionOverview({ query: { appKey: 'b922ceea' } }))

  return (
    <>
      <Row gutter={[16, 16]} className="mt-4" justify="center">
        <Col span={24} md={8}>
          {userOverviewLoading ? <Skeleton /> : <TotalCard
            title="总用户数"
            increase={userOverviewData.tu > userOverviewData.statistics[0].appTu}
            count={userOverviewData.tu.toString()}
            percent={Math.abs(((userOverviewData.tu / userOverviewData.statistics[0].appTu) - 1)).toFixed(2) + '%'}
            chartData={userOverviewData.statistics.map((item) => item.appTu).reverse()}
          />}
        </Col>

        <Col span={24} md={8}>
          {userOverviewLoading ? <Skeleton /> : <TotalCard
            title="日活用户数"
            increase={userOverviewData.dau > userOverviewData.statistics[0].appDau}
            count={userOverviewData.dau.toString()}
            percent={Math.abs(((userOverviewData.dau / userOverviewData.statistics[0].appDau) - 1)).toFixed(2) + '%'}
            chartData={userOverviewData.statistics.map((item) => item.appDau).reverse()}
          />}
        </Col>

        <Col span={24} md={8}>
          {userOverviewLoading ? <Skeleton /> : <TotalCard
            title="新增用户数"
            increase={userOverviewData.nu > userOverviewData.statistics[0].appNu}
            count={userOverviewData.nu.toString()}
            percent={Math.abs(((userOverviewData.nu / userOverviewData.statistics[0].appNu) - 1)).toFixed(2) + '%'}
            chartData={userOverviewData.statistics.map((item) => item.appNu).reverse()}
          />}
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-4" justify="center">
        <Col span={24} md={12} lg={8}>
          { versionOverviewLoading ? <Skeleton /> : <AppVersion charData={versionOverviewData} /> }
        </Col>
        <Col span={24} md={12} lg={16}>
        { regionOverviewLoading ? <Skeleton /> : <UserRegion categories={regionOverviewData.map((item) => item.ipRegion)} series={regionOverviewData.map((item) => Number(item.count))} /> }
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-4" justify="center">
        <Col span={24} md={24} lg={24}>
          { userOverviewLoading ? <Skeleton /> : <TrackList tableData={userOverviewData.statistics} /> }
        </Col>
      </Row>
    </>
  );
}

export default Workbench;