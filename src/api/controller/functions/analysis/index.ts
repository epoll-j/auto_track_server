import { DataAnalysisService } from '@/api/service/data.analysis.service';
import {
    Api,
    Get,
    Query,
    useContext,
    useInject
} from '@midwayjs/hooks';
import { Context } from '@midwayjs/koa';


export const getUserOverview = Api(
    Get(),
    Query<{ appKey: string }>(),
    async () => {
        const ctx = useContext<Context>();
        const { appKey } = ctx.query;
        const service = await useInject(DataAnalysisService)
        return await service.getUserOverview(appKey as string);
    }
)

export const getUserAppVersionOverview = Api(
    Get(),
    Query<{ appKey: string }>(),
    async () => {
        const ctx = useContext<Context>();
        const { appKey } = ctx.query;
        const service = await useInject(DataAnalysisService)
        return await service.getUserAppVersionOverview(appKey as string);
    }
)

export const getUserRegionOverview = Api(
    Get(),
    Query<{ appKey: string }>(),
    async () => {
        const ctx = useContext<Context>();
        const { appKey } = ctx.query;
        const service = await useInject(DataAnalysisService)
        return await service.getUserRegionOverview(appKey as string);
    }
)

export const getTrackList = Api(
    Get(),
    Query<{
        appKey: string,
        time?: string,
        userId?: string,
        uniqueId?: string,
        deviceId?: string,
        page: string,
        size: string
    }>(),
    async () => {
        const ctx = useContext<Context>();
        const { appKey, time, userId, uniqueId, deviceId, page, size } = ctx.query;
        const service = await useInject(DataAnalysisService)
        return await service.getTrackList(appKey as string, time as string, userId as string, uniqueId as string, deviceId as string, Number(page), Number(size));
    }
)

export const getTrackInfo = Api(
    Get(),
    Query<{ appKey: string, trackId: string }>(),
    async () => {
        const ctx = useContext<Context>();
        const { appKey, trackId } = ctx.query;
        const service = await useInject(DataAnalysisService)
        return await service.getTrackInfo(appKey as string, trackId as string);
    }
)