import { Select, Space, Typography } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';

import Card from '@/web/components/card';
import Scrollbar from '@/web/components/scrollbar';
import { TrackStatistics } from '@/api/db_entity/TrackStatistics';
import { useState } from 'react';

interface DataType {
  track_type: string;
  track_key: string;
  num: number;
}

type Props = {
  tableData: TrackStatistics[];
};

export default function TrackList({ tableData }: Props) {
  const columns: ColumnsType<DataType> = [
    {
      title: 'Key',
      dataIndex: 'track_key',
      key: 'track_key',
      render: (text) => <span>{text}</span>,
    },
    {
      title: 'Type',
      dataIndex: 'track_type',
      key: 'track_type',
    },
    {
      title: 'Count',
      dataIndex: 'num',
      key: 'num',
      render: (text) => <span>{text}</span>,
    },
  ];

  const [data, setData] = useState<DataType[]>(JSON.parse(tableData[0].otherParams))
  

  return (
    <Card className="flex-col">
      <header className="flex justify-between items-center w-full mb-3">
        <Typography.Title level={5}>用户操作事件统计</Typography.Title>
        <Select onChange={(val) => setData(JSON.parse(tableData[val].otherParams))} defaultValue={0} options={tableData.map((item, index) => ({ label: item.dataTime, value: index }))} />
      </header>
      <main className="w-full">
        <Scrollbar>
          <Table columns={columns} dataSource={data} />
        </Scrollbar>
      </main>
    </Card>
  );
}
