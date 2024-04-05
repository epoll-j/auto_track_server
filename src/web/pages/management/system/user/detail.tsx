import { USER_LIST } from '@/web/_mock/assets';
import Card from '@/web/components/card';
import { useParams } from '@/web/router/hooks';

import type { UserInfo } from '@/types/entity';

const USERS: UserInfo[] = USER_LIST;

export default function UserDetail() {
  const { id } = useParams();
  const user = USERS.find((user) => user.id === id);
  return (
    <Card>
      <p>这是用户{user?.username}的详情页面</p>
    </Card>
  );
}
