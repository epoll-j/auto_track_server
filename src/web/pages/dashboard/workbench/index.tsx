import { Col, Row, Space } from 'antd';

import AreaDownload from './area-download';
import BannerCard from './banner-card';
import { Applications, Conversion } from './conversion_applications';
import AppVersion from './app-version';
import NewInvoice from './new-invoice';
import TopAuthor from './top-authors';
import TopInstalled from './top-installed';
import TopRelated from './top-related';
import TotalCard from './total-card';
import { getUserOverview, getUserAppVersionOverview } from '@/api/controller/functions/analysis';
import { useRequest } from 'ahooks';
import { Skeleton } from 'antd';

function Workbench() {

  const { data: userOverviewData, loading: userOverviewLoading } = useRequest(() => getUserOverview({ query: { appKey: 'b922ceea' } }))
  const { data: versionOverviewData, loading: versionOverviewLoading } = useRequest(() => getUserAppVersionOverview({ query: { appKey: 'b922ceea' } }))

  return (
    <>
      {/* <Row gutter={[16, 16]} justify="center">
        <Col span={24} md={16}>
          <BannerCard />
        </Col>
        <Col span={24} md={8}>
          <Space direction="vertical" size="middle" className="h-full w-full">
            <Conversion />
            <Applications />
          </Space>
        </Col>
      </Row> */}

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
          <AreaDownload />
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-4" justify="center">
        <Col span={23} md={12} lg={16}>
          <NewInvoice />
        </Col>
        <Col span={23} md={12} lg={8}>
          <TopRelated />
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-4" justify="center">
        <Col span={24} md={12}>
          <TopInstalled />
        </Col>

        <Col span={24} md={12}>
          <TopAuthor />
        </Col>
      </Row>
    </>
  );
}

export default Workbench;