import { Provide, Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { TrackStatistics } from '../db_entity/TrackStatistics';
import moment from 'moment';
import { RedisService } from '@midwayjs/redis';
import { AppUser } from '../db_entity/AppUser';

@Provide()
export class DataAnalysisService {

    @InjectEntityModel(TrackStatistics)
    statisticsRepo: Repository<TrackStatistics>;
    @InjectEntityModel(AppUser)
    appUserRepo: Repository<AppUser>;
    @Inject()
    redis: RedisService

    async getUserOverview(appKey: string) {
        const statistics = await this.statisticsRepo.find({
            where: {
                dataTime: MoreThanOrEqual(moment().subtract(30, 'days').toDate()),
                appKey,
            },
            order: {
                dataTime: 'DESC'
            },
            select: ['dataTime', 'appTu', 'appNu', 'appDau', 'otherParams']
        })
        const dauKey = `${appKey}:dau`;
        const nuKey = `${appKey}:nu`;
        const nu = Number(await this.redis.get(nuKey) || 0);
        const dau = await this.redis.bitcount(dauKey) || 0;
        const tu = await this.appUserRepo.countBy({
            appKey
        })
        statistics.map(item => {
            item.dataTime = moment(item.dataTime).format('YYYY-MM-DD') as any
        })
        return {
            nu,
            dau,
            tu,
            statistics
        }
    }

    async getUserAppVersionOverview(appKey: string) {
        const versionData = await this.appUserRepo.createQueryBuilder('appUser')
            .select('appUser.appVersion', 'appVersion')
            .addSelect('COUNT(appUser.id)', 'count')
            .where('appUser.appKey = :appKey', { appKey })
            .groupBy('appUser.appVersion')
            .orderBy('count', 'DESC')
            .getRawMany()

        return versionData
    }

    async getUserRegionOverview(appKey: string) {
        const regionData = await this.appUserRepo.createQueryBuilder('appUser')
            .select('appUser.ipRegion', 'ipRegion')
            .addSelect('COUNT(appUser.id)', 'count')
            .where('appUser.appKey = :appKey', { appKey })
            .groupBy('appUser.ipRegion')
            .orderBy('count', 'DESC')
            .getRawMany()

        return regionData
    }
}
