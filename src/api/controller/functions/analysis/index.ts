import { DataAnalysisService } from '@/api/service/data.analysis.service';
import {
    Api,
    Get,
    Query,
    useContext,
    useInject
} from '@midwayjs/hooks';
import { Context } from '@midwayjs/koa';


export const getDashboard = Api(
    Get(),
    Query<{ appKey: string }>(),
    async () => {
        const ctx = useContext<Context>();
        const { appKey } = ctx.query;
        const service = await useInject(DataAnalysisService)
        return await service.getDashboard(appKey as string);
    }
)