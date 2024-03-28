import { AppService } from '../../../service/apps.service';
import {
    Api,
    Get,
    useInject
} from '@midwayjs/hooks';


export const getApps = Api(
    Get(),
    async () => {
        const service = await useInject(AppService)
        return await service.getApps();
    }
)