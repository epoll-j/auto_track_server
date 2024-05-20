import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  DatePicker,
  Space,
  Timeline,
  Typography,
  Spin,
  Popover,
} from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { usePagination, useRequest } from 'ahooks';
import orgService from '@/web/api/services/orgService';
import { IconButton, Iconify, SvgIcon } from '@/web/components/icon';
import ProTag from '@/web/theme/antd/components/tag';

import { Organization } from '@/types/entity';
import { getTrackInfo, getTrackList } from '@/api/controller/functions/analysis';
import { UserTrack } from '@/api/db_entity/UserTrack';
import moment from 'moment';
import { InfoCircleOutlined, LineChartOutlined, MenuOutlined } from '@ant-design/icons';
import { useThemeToken } from '@/web/theme/hooks';
import { faker } from '@faker-js/faker';

type SearchType = {
  userId?: string;
  deviceId?: string;
  uniqueId?: string;
  time?: [Date, Date];
};
const { RangePicker } = DatePicker;

export default function UserAnalysisPage() {
  const { data: trackList, loading: trackListLoading, run, pagination } = usePagination(({ current, pageSize }, formVals) => getTrackList({
    query: {
      appKey: 'b922ceea',
      page: current,
      size: pageSize,
      ...formVals
    }
  }), { manual: true })

  const [searchForm] = Form.useForm();
  const [showParamsModalPros, setShowParamsModalProps] = useState<ParamsModalProps>({
    show: false,
    params: '{}',
    onOk: () => {
      setShowParamsModalProps((prev) => ({ ...prev, show: false }));
    },
    onCancel: () => {
      setShowParamsModalProps((prev) => ({ ...prev, show: false }));
    },
  });

  useEffect(() => {
    run({ current: 1, pageSize: 10 }, {})
  }, [])

  const [timelineModalPros, setTimelineModalProps] = useState<ParamsModalProps>({
    show: false,
    params: '',
    onOk: () => {
      setTimelineModalProps((prev) => ({ ...prev, show: false }));
    },
    onCancel: () => {
      setTimelineModalProps((prev) => ({ ...prev, show: false }));
    },
  });

  const columns: ColumnsType<UserTrack> = [
    { title: 'id', dataIndex: 'id' },
    { title: 'TrackId', dataIndex: 'trackId' },
    { title: 'TrackType', dataIndex: 'trackType' },
    { title: 'TrackKey', dataIndex: 'trackKey' },
    { title: 'UserId', dataIndex: 'userId' },
    { title: 'UniqueId', dataIndex: 'uniqueId' },
    { title: 'DeviceId', dataIndex: 'deviceId' },
    { title: 'AppVersion', dataIndex: 'appVersion' },
    { title: 'TrackIP', dataIndex: 'trackIp' },
    { title: 'TrackTime', dataIndex: 'trackTime', render: (value) => moment(value).format('YYYY-MM-DD HH:mm:ss') },
    {
      title: 'Detail',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <div className="flex w-full justify-center text-gray">
          <IconButton onClick={() => onShowParams(record)}>
            <MenuOutlined />
          </IconButton>
          <IconButton onClick={() => onShowTimeline(record)}>
            <LineChartOutlined />
          </IconButton>
        </div>
      ),
    },
  ];

  const onSearchFormReset = () => {
    searchForm.resetFields();
  };

  const onShowParams = (record: UserTrack) => {
    setShowParamsModalProps((pre) => ({
      ...pre,
      show: true,
      params: record.trackParams,
    }))
  }

  const onShowTimeline = (record: UserTrack) => {
    setTimelineModalProps((pre) => ({
      ...pre,
      show: true,
      params: record.trackId,
    }))
  }

  const onFinish = (values: SearchType) => {
    run({ current: 1, pageSize: 10 }, JSON.parse(JSON.stringify(values)))
  };

  return (
    <Space direction="vertical" size="large" className="w-full">
      <Card>
        <Form form={searchForm} onFinish={onFinish}>
          <Row gutter={[16, 16]}>
            <Col span={24} lg={20}>
              <Row>
                <Form.Item<SearchType> name="userId" className="!mb-0 !mr-1 w-[150px]">
                  <Input placeholder='User ID' />
                </Form.Item>
                <Form.Item<SearchType> name="uniqueId" className="!mb-0 !mr-1 w-[150px]">
                  <Input placeholder='Unique ID' />
                </Form.Item>
                <Form.Item<SearchType> name="deviceId" className="!mb-0 !mr-1 w-[150px]">
                  <Input placeholder='Device ID' />
                </Form.Item>
                <Form.Item<SearchType> name="time" className="!mb-0">
                  <RangePicker showTime />
                </Form.Item>
              </Row>
            </Col>
            <Col span={24} lg={4}>
              <div className="flex justify-end">
                <Button onClick={onSearchFormReset}>Reset</Button>
                <Button type="primary" className="ml-4" htmlType="submit">
                  Search
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card
        title="Track List"
      >
        <Table
          rowKey="id"
          size="small"
          scroll={{ x: 'max-content' }}
          loading={trackListLoading}
          columns={columns}
          dataSource={(trackList || {}).list}
          pagination={pagination}
        />
      </Card>

      <ShowParamsModal {...showParamsModalPros} />
      <TimelineModal {...timelineModalPros} />
    </Space>
  );
}

type ParamsModalProps = {
  show: boolean;
  params: string;
  onOk: VoidFunction;
  onCancel: VoidFunction;
};

function ShowParamsModal({ show, params, onOk, onCancel }: ParamsModalProps) {
  return (
    <Modal title="Detail" open={show} onOk={onOk} onCancel={onCancel}>
      <pre><code>{JSON.stringify(JSON.parse(params), null, 2)}</code></pre>
    </Modal>
  );
}

function TimelineModal({ show, params, onOk, onCancel }: ParamsModalProps) {
  const theme = useThemeToken();
  const { data, loading, run } = useRequest(() => getTrackInfo({
    query: {
      appKey: 'b922ceea',
      trackId: params
    }
  }), {
    manual: true,
    loadingDelay: 500
  })
  useEffect(() => {
    if (show) {
      run();
    }
  }, [params])



  return (
    <Modal title="Activity Timeline" className='' open={show} onOk={onOk} onCancel={onCancel}>
      {loading ? <Spin /> :
        <Timeline
          className="!mt-4 !pt-2 w-full max-h-[60vh] overflow-y-auto"
          items={(data || []).map((item) => (
            {
              color: theme.colorError,
              children: (
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <Typography.Text strong>{item.trackKey}</Typography.Text>
                    <div className="opacity-50">{moment(item.trackTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                  </div>
                  <Typography.Text type="secondary" className="text-xs">
                    {item.trackType}
                  </Typography.Text>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-medium opacity-60">IP:{item.trackIp}</span>
                    <span className="font-medium opacity-60">Version:{item.appVersion || '0.0.0'}</span>
                    <Popover content={
                      <pre className='!max-w-[400px] overflow-x-auto'><code>{JSON.stringify(JSON.parse(item.trackParams || '{}'), null, 2)}</code></pre>
                    } title="Params" >
                      <InfoCircleOutlined />
                    </Popover>
                  </div>
                </div>
              ),
            }
          ))}
        />}
    </Modal>
  );
}
