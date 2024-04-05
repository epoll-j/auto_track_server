import { Card, Typography } from 'antd';
import { useMemo } from 'react';

import MotionViewport from '@/web/components/animate/motion-viewport';
import { getVariant } from '@/web/components/animate/variants';
import { useThemeToken } from '@/web/theme/hooks';

type Props = {
  variant: string;
};
export default function ContainerView({ variant }: Props) {
  const { colorBgLayout } = useThemeToken();
  const varients = useMemo(() => getVariant(variant), [variant]);

  return (
    <div
      key={variant}
      className="h-[480px] overflow-scroll rounded-lg px-20"
      style={{ backgroundColor: colorBgLayout }}
    >
      {[...Array(40)].map((_, index) => (
        <MotionViewport key={index} variants={varients} className="mt-4">
          <Card>
            <Typography className="text-center">Item {index + 1}</Typography>
          </Card>
        </MotionViewport>
      ))}
    </div>
  );
}
